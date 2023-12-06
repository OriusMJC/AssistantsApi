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

  async createThread(input: any) {
    const thread = await this.apiSession.beta.threads.create({
      messages: [
        {
          role: 'user',
          content: input.content,
        },
      ],
    });

    return thread;
  }

  async createMessage(input) {
    const message = await this.apiSession.beta.threads.messages.create(
      input.threadId,
      {
        role: 'user',
        content: input.content,
      },
    );

    return message;
  }

  async listMessages(thread_id: string) {
    const messages = await this.apiSession.beta.threads.messages.list(
      thread_id,
    );

    return messages;
  }

  async runThread(input: any) {
    const run = await this.apiSession.beta.threads.runs.create(input.threadId, {
      assistant_id: input.assistantId,
      model: 'gpt-4-1106-preview',
      // instructions: "additional instructions",
      tools: [{ type: 'code_interpreter' }, { type: 'retrieval' }],
    });
    return run;
  }
}
