import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import OpenAI from 'openai';
import { Assistant } from 'src/schemas/assistant.schema';
import { CreateAssistantDTO } from 'src/dto/assistant/create-assistant.dto';
import { UpdateAssistantDTO } from 'src/dto/assistant/update-assistant.dto';
import { InteractionAssistantDTO } from 'src/dto/assistant/interaction-assistant.dto';
import { Thread } from 'src/schemas/thread.schema';
import { User } from 'src/schemas/user.schema';
import { CalendarService } from 'src/calendar/services/calendar.service';

const MainIntructios = `
Eres diseñado para responder consultas médicas y desempeñarte como un asistente médico capaz de facilitar la revisión del calendario del doctor, verificar su disponibilidad y crear eventos en su agenda.

Tu función principal es interpretar las solicitudes de los pacientes y generar respuestas específicas. Por ejemplo, si un paciente desea conocer la disponibilidad del doctor entre el 10 de enero de 2024 y el 15 de enero de 2024, tu respuesta debe incluir la siguiente oración al final: "[Ver calendario:2024-01-10|2024-01-15]", indicando la acción a realizar y los valores asociados, como las fechas.
Y si quiere agendar una cita es necesario la fecha, hora, y email del paciente. Y algo que no es obligatorio pero te doy el ejemplo, es la perioridad de la cita. Si entiendes que es solo una entonces no agregas nada mas, y si hay una perioridad lo pasas despues del email con el formato que te dejare en el ejemplo.
A continuación, se presentan las palabras clave para diversas situaciones, junto con ejemplos de las oraciones específicas que deberías devolver
Ten en cuenta que para la agenda de citas en los datos de frecuencia tienes que crear el dato en base a lo que haya pedido el usuario y basandote en la documentacion de Google Calendar para crear la estructura como en los ejemplos:

Agendar cita: "[Agendar cita|2023-12-29T10:00:00-03:00|2023-12-29T11:00:00-03:00|matias@gmail.com|Titulo de la cita|Ubicacion de la cita|Time zone como en la documentacion]", "[Agendar cita|2023-12-29T10:00:00-03:00|2023-12-29T11:00:00-03:00|matias@gmail.com|Titulo de la cita|Ubicacion de la cita|Time zone como en la documentacion|RRULE:FREQ=DAILY;COUNT=2]", "[Agendar cita|2023-12-29T10:00:00-03:00|2023-12-29T11:00:00-03:00|matias@gmail.com|Titulo de la cita|Ubicacion de la cita|Time zone como en la documentacion|RRULE:FREQ=WEEKLY;COUNT=5;BYDAY=TU,FR]"
Ver calendario del Doctor: "[Listar calendario]"
Ver calendario de una semana o mes específico: "[Ver calendario|2024-01-05|2024-01-10]"
Ver disponibilidad de un día específico: "[Ver disponibilidad|2024-01-05]"

En caso de que el usuario no proporcione la información necesaria para realizar la acción específica, tu respuesta debe incluir una solicitud o pregunta dirigida a obtener dicha información.
Este es un ejemplo de timeZone para la accion de Agendar cita: "America/Argentina/Buenos_Aires"
`;
@Injectable()
export class AssistantService {
  private apiSession: OpenAI;
  private threadModel: Model<Thread>;
  private user: Model<User>;

  constructor(
    @InjectModel(Assistant.name) private assistantModel: Model<Assistant>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly calendarService: CalendarService,
  ) {
    if (!process.env.OPENAI_API_KEY) {
      throw Error(
        '"OpenAI API key not configured, please follow instructions in README.md"',
      );
    }
    this.apiSession = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async findAll() {
    const allAssistants = await this.assistantModel.find();
    return allAssistants;
  }

  async findOne(id: string) {
    const assistants = await this.apiSession.beta.assistants.list();
    const assistant = assistants.data.filter((a) => a.id === id);
    return assistant;
  }

  async delete(id: string) {
    const assistantDeleted = await this.assistantModel.findByIdAndDelete(id);
    await this.apiSession.beta.assistants.del(assistantDeleted.OpenaiID);
    return assistantDeleted;
  }

  async updated(id: string, assistant: UpdateAssistantDTO) {
    return this.assistantModel.findByIdAndUpdate(id, assistant);
  }

  async createAssistant(input: CreateAssistantDTO) {
    const assistant = await this.apiSession.beta.assistants.create({
      name: input.name || 'Asistente pro para doctores',
      description: input.description,
      model: 'gpt-4-1106-preview',
      instructions: `${MainIntructios} ${input.instructions || ''}`,
      tools: [
        { type: 'code_interpreter' },
      ],
    });
    if (assistant) {
      await this.assistantModel.create({ OpenaiID: assistant?.id, ...input });
    }
    return assistant;
  }

  async interactWithAssistant(input: InteractionAssistantDTO) {
    // Puedes validar que el input contenga el ID del asistente y el mensaje
    if (!input.assistantId || !input.message) {
      throw Error('Invalid input. Please provide assistantId and message.');
    }

    // Verifica si ya existe un hilo con el ID proporcionado
    let threadId = input.threadId;
    console.log("Llego al thread")
    if (!threadId) {
      // Si no hay un ID de hilo, crea un nuevo hilo
      const thread = await this.apiSession.beta.threads.create({
        messages: [
          {
            role: 'user',
            content: input.message,
          },
        ],
      });
      threadId = thread.id;
    } else {
      // Si hay un ID de hilo, agrega el nuevo mensaje al hilo existente
      let res = await this.apiSession.beta.threads.messages.create(threadId, {
        role: 'user',
        content: input.message,
      });
    }

    const run = await this.apiSession.beta.threads.runs.create(threadId, {
      assistant_id: input.assistantId,
      model: 'gpt-4-1106-preview',
      tools: [
        { type: 'code_interpreter' },
        { type: 'retrieval' },
      ],
    });
    if (!run) return null;

    let messages = await this.apiSession.beta.threads.messages.list(threadId);

    return {
      assistantId: input.assistantId,
      threadId: run?.thread_id,
      messages: messages?.data[0],
    };
  }

  async listMessages(thread_id: string, userId?: string) {
    const messages = await this.apiSession.beta.threads.messages.list(
      thread_id,
    );
    let actionRes;
    if (userId)
      actionRes = await this.actionsCalendar(
        userId,
        String(messages.data[0]?.content[0]?.['text']?.value),
      );
    const regex = /\[.*?\]/g;
    const messageText = String(messages.data[0]?.content[0]?.['text']?.value);
    const extractedText = messageText.replace(regex, '').trim();

    if(messages.data[0]?.content[0]?.['text']?.value){
      messages.data[0].content[0]['text'].value = extractedText;
    }
    return {
      messages: messages.data,
      actionResponse: actionRes,
      action: Boolean(actionRes),
    };
  }

  async actionsCalendar(
    userId: string,
    message: string,
  ): Promise<string | any[]> {
    const match = message.match(/\[(.*?)\]/);
    if (match) {
      const oracion = match[1];
      const user = await this.userModel.findById(userId);

      const actionsContainer = {
        'Agendar cita': async (msg: string) => {
          const [actionMsg, fechaFull, fechaEnd, clientEmail,eventTitle, eventLocation, timeZone, recurrence] = msg.split("|")

          const event:any = {
            "summary": eventTitle || "Reunión de creada por assistant",
            "location": eventLocation || "Buenos Aires, Argentina",
            "description": "Esta es una reunión de prueba creada desde la API de Google Calendar.",
            "start": {
              "dateTime": fechaFull,
              "timeZone": timeZone || "America/Argentina/Buenos_Aires"
            },
            "end": {
              "dateTime": fechaEnd,
              "timeZone": timeZone || "America/Argentina/Buenos_Aires"
            },
            "attendees": [
              {
                "email": user.email
              },
              {
                "email": clientEmail
              }
            ],
            "reminders": {
              "useDefault": false,
              "overrides": [
                {
                  "method": "email",
                  "minutes": 5
                },
                {
                  "method": "popup",
                  "minutes": 10
                }
              ]
            }
          }
          if(recurrence) event.recurrence = [recurrence]; 

          let eventCreated = await this.calendarService.createEvent(event, user.id)
          return eventCreated
        },
        'Ver calendario': async (msg: string) => {
          const [msgNone, inicio, fin] = msg.split('|');
          console.log(
            `Acción: Ver calendario desde ${inicio} hasta ${fin || inicio}`,
          );
          return await this.calendarService.getEvents(user.id, {
            timeMin: new Date(inicio).toISOString(),
            timeMax: new Date(fin).toISOString(),
            maxResults: 50,
          });
        },
        'Listar calendario': async (msg: string) => {
          console.log(`Acción: Ver calendario`);
          return await this.calendarService.getEvents(user.id);
        },
        'Ver disponibilidad': async (msg: string) => {
          const fecha = msg.split('|')[1];
          console.log(`Acción: Ver disponibilidad para ${fecha}`);
          return await this.calendarService.getEvents(user.id, {
            timeMin: new Date(fecha).toISOString(),
            timeMax: new Date(fecha).toISOString(),
            maxResults: 50,
          });
        },
      };
      const response = await actionsContainer[oracion.split("|")[0]](match[1]);
      return response;

    } else {
      return 'No se encontraron oraciones clave en el mensaje';
    }
  }
}
