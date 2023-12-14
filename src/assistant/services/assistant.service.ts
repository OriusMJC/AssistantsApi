import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import OpenAI from 'openai';
import { Assistant } from 'src/schemas/assistant.schema';
import { CreateAssistantDTO } from 'src/dto/assistant/create-assistant.dto';
import { UpdateAssistantDTO } from 'src/dto/assistant/update-assistant.dto';
import { InteractionAssistantDTO } from 'src/dto/assistant/interaction-assistant.dto';
import { Thread } from 'src/schemas/thread.schema';
import { CreateThreadDTO } from 'src/dto/thread/create-thread.dto';
import { MessageContentText } from 'openai/resources/beta/threads/messages/messages';

@Injectable()
export class AssistantService {
  private apiSession: OpenAI;
  private threadModel: Model<Thread>;
  constructor(@InjectModel(Assistant.name) private assistantModel: Model<Assistant>) {
    if (!process.env.OPENAI_API_KEY) {
      throw Error(
        '"OpenAI API key not configured, please follow instructions in README.md"',
      );
    }
    this.apiSession = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async findAll(){
    const allAssistants = await this.assistantModel.find();
    // const assistants = await this.apiSession.beta.assistants.list();
    return allAssistants;
    // return assistants;
  }

  async findOne(id:string){
    const assistants = await this.apiSession.beta.assistants.list();
    const assistant = assistants.data.filter((a)=> a.id === id);
    // const assistant = await this.assistantModel.findById(id);
    return assistant;
  }

  async delete(id:string){
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

  async updated(id:string, assistant:UpdateAssistantDTO){
    return this.assistantModel.findByIdAndUpdate(id, assistant);
  }

  async createAssistant(input: CreateAssistantDTO) {
    const assistant = await this.apiSession.beta.assistants.create({
      name: input.name || 'Asistente pro para doctores',
      description: input.description,
      model: 'gpt-4-1106-preview',
      instructions: input.instructions || '',
      tools: [
        { type: 'code_interpreter' },
        {
          type: 'function',
          function: {
            name: 'getDoctorGoogleCalendar',
            description:
              "Get doctor's google calendar in order to check availability",
            parameters: {
              type: 'object',
              properties: {
                calendar: {
                  id: input.GoogleCalendarID || '373920759873-cq5mmnide6lrklvpbda0ftk01do75ul4.apps.googleusercontent.com',
                },
              },
            },
          },
        },
      ],
    });
    if(assistant){
      await this.assistantModel.create({OpenaiID: assistant?.id, ...input})
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
      // console.log("Llega hasta aca", threadId)
      // const newThread:CreateThreadDTO = {threadId: threadId, userId: input.userId, assistantId: input.assistantId};
      // let threadDb = await this.threadModel.create(newThread)
      // console.log("Y tmb Llega hasta aca", threadDb)
    } else {
      // Si hay un ID de hilo, agrega el nuevo mensaje al hilo existente
      await this.apiSession.beta.threads.messages.create(threadId, {
        role: 'user',
        content: input.message,
      });
    }

    const run = await this.apiSession.beta.threads.runs.create(threadId, {
      assistant_id: input.assistantId,
      model: 'gpt-4-1106-preview',
      tools: [{ type: 'code_interpreter' }, { type: 'retrieval' },{
        type: 'function',
        function: {
          name: 'getDoctorGoogleCalendar',
          description:
            "Get doctor's google calendar in order to check availability",
          parameters: {
            type: 'object',
            properties: {
              calendar: {
                id: '373920759873-cq5mmnide6lrklvpbda0ftk01do75ul4.apps.googleusercontent.com',
              },
            },
          },
        },
      },],
      // max_tokens: 50,
    });
    if(!run) return null

    let messages = await this.apiSession.beta.threads.messages.list(threadId);

    const maxAttempts = 50;
    let attempts = 0;
    if(messages && 'text' in messages.data[0].content[0]){
      let textContent = messages.data[0].content[0] as MessageContentText;
      console.log("ENtra al IF", String(textContent.text.value))
      while (messages?.data[0]?.role !== 'assistant' || String(textContent.text.value).length === 0 ) {
        // Espera un tiempo antes de realizar la siguiente solicitud
        await new Promise(resolve => setTimeout(resolve, 100));
        // console.log("Entro al while", messages?.data[0]?.role, textContent.text.value)
        // Realiza la solicitud para obtener los mensajes actualizados
        messages = await this.apiSession.beta.threads.messages.list(threadId);
        
        // attempts++;
      }
    }
    console.log("MESSAGE: ", messages?.data[0].content[0])
    return {assistantId: input.assistantId, threadId: run?.thread_id, messages: messages?.data[0]};
  }
  
  async listMessages(thread_id: string) {
    const messages = await this.apiSession.beta.threads.messages.list(
      thread_id,
    );
  
    return messages;
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

