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

A continuación, se presentan las palabras clave para diversas situaciones, junto con ejemplos de las oraciones específicas que deberías devolver:

Agendar cita: "[Agendar cita=2023-12-29T10:00:00-07:00]"
Ver calendario del Doctor: "[Listar calendario]"
Ver calendario de una semana o mes específico: "[Ver calendario=2024-01-05|2024-01-10]"
Ver disponibilidad de un día específico: "[Ver disponibilidad=2024-01-05]"
En caso de que el usuario no proporcione la información necesaria para realizar la acción específica, tu respuesta debe incluir una solicitud o pregunta dirigida a obtener dicha información.
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
    // const assistants = await this.apiSession.beta.assistants.list();
    return allAssistants;
    // return assistants;
  }

  async findOne(id: string) {
    const assistants = await this.apiSession.beta.assistants.list();
    const assistant = assistants.data.filter((a) => a.id === id);
    // const assistant = await this.assistantModel.findById(id);
    return assistant;
  }

  async delete(id: string) {
    // const assistants = await this.apiSession.beta.assistants.list();
    // for (const assistant of assistants.data) {
    //   await this.apiSession.beta.assistants.del(assistant.id);
    //   console.log("Se borro: ", assistant.id);
    // }
    // return 'se hizo'
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
      console.log("Llego al thread IF NO HAY")

      const thread = await this.apiSession.beta.threads.create({
        messages: [
          {
            role: 'user',
            content: input.message,
          },
        ],
      });
      console.log("Llego al thread IF NO HAY CREADO")
      threadId = thread.id;
      // console.log("Llega hasta aca", threadId)
      // const newThread:CreateThreadDTO = {threadId: threadId, userId: input.userId, assistantId: input.assistantId};
      // let threadDb = await this.threadModel.create(newThread)
      // console.log("Y tmb Llega hasta aca", threadDb)
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
      // max_tokens: 50,
    });
    if (!run) return null;
    console.log("Llego al MSG")

    let messages = await this.apiSession.beta.threads.messages.list(threadId);

    // const maxAttempts = 50;
    // let attempts = 0;
    // let actionRes;
    // if (messages && 'text' in messages.data[0].content[0]) {
    //   let textContent = messages.data[0].content[0] as MessageContentText;
    //   console.log('ENtra al IF', String(textContent.text.value));
    //   while (
    //     (messages?.data[0]?.role !== 'assistant' ||
    //     // !textContent?.text?.value ||
    //     textContent.text.value?.length === 0) &&
    //     attempts <= maxAttempts
    //   ) {
    //     console.log("Entre al while: ", messages?.data[0]?.role, " ", textContent.text.value)
    //     // Espera un tiempo antes de realizar la siguiente solicitud
    //     await new Promise((resolve) => setTimeout(resolve, 100));
    //     // console.log("Entro al while", messages?.data[0]?.role, textContent.text.value)
    //     // Realiza la solicitud para obtener los mensajes actualizados
    //     console.log("Entre al while antes del msg")
    //     messages = await this.apiSession.beta.threads.messages.list(threadId);
    //     console.log("Entre al while despues del msg")

    //     attempts++;
    //   }
    //   if(textContent.text.value?.length){
    //     console.log("Entro por length value")
    //     actionRes = await this.actionsCalendar(input.userId, String(textContent.text.value));
    //   }
    // }
    console.log('MESSAGE: ', messages?.data[0].content[0]);
    return {
      assistantId: input.assistantId,
      threadId: run?.thread_id,
      messages: messages?.data[0],
      // actionResponse: actionRes,
      // action: Boolean(actionRes),
    };
  }

  async listMessages(thread_id: string, userId?: string) {
    const messages = await this.apiSession.beta.threads.messages.list(
      thread_id,
    );
    let actionRes;
    console.log("Messageeee: ", messages.data[0]?.content[0]?.['text']?.value)
    if (userId)
      actionRes = await this.actionsCalendar(
        userId,
        String(messages.data[0]?.content[0]?.['text']?.value),
      );
    return {
      messages: messages,
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
          const fechaFull = msg.split("=")[1]
          const [fecha, hora] = fechaFull.split('T');  
          let [horaSinZona,zonaHoraria] = hora.split('-');  // Eliminar la zona horaria, si existe
          let [horaActual, minutos, segundos] = horaSinZona.split(':'); 

          // Convertir la hora a número, sumar una hora y formatear nuevamente
          let newhoraActual = parseInt(horaActual, 10) + 1;
          if (newhoraActual < 10) {
            newhoraActual = Number('0' + newhoraActual);
          }
          const fechaEnd = `${fecha}T${newhoraActual}:${minutos}:${segundos}-${zonaHoraria}`
          console.log(`Acción: Agendar cita para ${fechaFull}`);
          const event = {
            "summary": "Reunión de prueba creada por assistant",
            "location": "Buenos Aires, Argentina",
            "description": "Esta es una reunión de prueba creada desde la API de Google Calendar.",
            "start": {
              "dateTime": fechaFull,
              "timeZone": "America/Argentina/Buenos_Aires"
            },
            "end": {
              "dateTime": fechaEnd,
              "timeZone": "America/Argentina/Buenos_Aires"
            },
            "attendees": [
              {
                "email": user.email
              },
              {
                "email": "angelvegaxdpro08@gmail.com"
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
          let eventCreated = await this.calendarService.createEvent(event, user.id)
          // return `Acción: Agendar cita para ${fecha}`;
          return eventCreated
        },
        'Ver calendario': async (msg: string) => {
          const [inicio, fin] = msg.split('=')[1].split('|');
          console.log(
            `Acción: Ver calendario desde ${inicio} hasta ${fin || inicio}`,
          );
          return `Acción: Ver calendario desde ${inicio} hasta ${
            fin || inicio
          }`;
        },
        'Listar calendario': async (msg: string) => {
          console.log(`Acción: Ver calendario`);
          return await this.calendarService.getEvents(user.id);
        },
        'Ver disponibilidad': async (msg: string) => {
          const fecha = msg.split('=')[1];
          console.log(`Acción: Ver disponibilidad para ${fecha}`);
          return `Acción: Ver disponibilidad para ${fecha}`;
        },
      };

      const response = await actionsContainer[oracion.split("=")[0]](match[1]);
      return response;

    } else {
      console.log('No se encontraron oraciones clave en el mensaje');
      return 'No se encontraron oraciones clave en el mensaje';
    }
  }
}

// async createThread(input: any) {
//   const thread = await this.apiSession.beta.threads.create({
//     messages: [
//       {
//         role: 'user',
//         content: input.content,
//       },
//     ],
//   });

//   return thread;
// }

// async createMessage(input) {
//   const message = await this.apiSession.beta.threads.messages.create(
//     input.threadId,
//     {
//       role: 'user',
//       content: input.content,
//     },
//   );

//   return message;
// }

// async runThread(input: any) {
//   const run = await this.apiSession.beta.threads.runs.create(input.threadId, {
//     assistant_id: input.assistantId,
//     model: 'gpt-4-1106-preview',
//     // instructions: "additional instructions",
//     tools: [{ type: 'code_interpreter' }, { type: 'retrieval' }],
//   });
//   return run;
// }
