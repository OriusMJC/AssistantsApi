import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { AssistantService } from '../services/assistant.service';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly service: AssistantService) {}

  @Get()
  getMati() {
    return 'mati';
  }

  @Post('create')
  @HttpCode(HttpStatus.OK)
  async getHello(@Body() body: any) {
    return await this.service.createAssistant(body);
  }

  // @Post('create-thread')
  // @HttpCode(HttpStatus.OK)
  // async createThread(@Body() body: any) {
  //   return await this.service.createThread(body);
  // }

  // @Post('create-message')
  // @HttpCode(HttpStatus.OK)
  // async createMessage(@Body() body: any) {
  //   return await this.service.createMessage(body);
  // }

  // @Get('list-messages')
  // @HttpCode(HttpStatus.OK)
  // async listMessages(@Query('thread_id') paramValue: string) {
  //   return await this.service.listMessages(paramValue);
  // }

  // @Post('run-thread')
  // @HttpCode(HttpStatus.OK)
  // async runThread(@Body() body: any) {
  //   return await this.service.runThread(body);
  // }

  @Post('interaction')
  @HttpCode(HttpStatus.OK)
  async interactWithAssistant(@Body() body: any) {
    try {
      const response = await this.service.interactWithAssistant(body);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: 'Error interacting with the assistant.' };
    }
  }
}
