import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AssistantService {
  private apiSession: OpenAI;
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw Error(
        '"OpenAI API key not configured, please follow instructions in README.md"',
      );
    }
    this.apiSession = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async createAssistant(input: any) {
    const assistant = await this.apiSession.beta.assistants.create({
      name: 'Asistente pro para doctores',
      description: input.description,
      model: 'gpt-4-1106-preview',
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
                  id: 'string',
                },
              },
            },
          },
        },
      ],
    });

    return assistant;
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

  // async listMessages(thread_id: string) {
  //   const messages = await this.apiSession.beta.threads.messages.list(
  //     thread_id,
  //   );

  //   return messages;
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

  async interactWithAssistant(input: any) {
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
      tools: [{ type: 'code_interpreter' }, { type: 'retrieval' }],
      // max_tokens: 50,
    });
    if(!run) return null
    let messages = await this.apiSession.beta.threads.messages.list(threadId);
    // console.log(messages.data)
    const maxAttempts = 20;
    let attempts = 0;
    while (messages?.data[0]?.role !== 'assistant' && attempts < maxAttempts) {
      // Espera un tiempo antes de realizar la siguiente solicitud
      await new Promise(resolve => setTimeout(resolve, 100));
  
      // Realiza la solicitud para obtener los mensajes actualizados
      messages = await this.apiSession.beta.threads.messages.list(threadId);
      
      attempts++;
    }

    return {assistantId: input.assistantId, threadId: run?.thread_id, messages: messages?.data[0]};
  }
}
