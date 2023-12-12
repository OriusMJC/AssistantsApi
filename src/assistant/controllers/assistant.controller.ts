import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Delete,
  Query,
  Param,
  Put
} from '@nestjs/common';
import { AssistantService } from '../services/assistant.service';
import { CreateAssistantDTO } from 'src/dto/assistant/create-assistant.dto';
import { UpdateAssistantDTO } from 'src/dto/assistant/update-assistant.dto';
import { InteractionAssistantDTO } from 'src/dto/assistant/interaction-assistant.dto';

@Controller('assistant')
export class AssistantController {
  constructor(private assistantService: AssistantService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.assistantService.findAll();
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id:string) {
    return this.assistantService.findOne(id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id:string) {
    return this.assistantService.delete(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id:string, @Body() body: UpdateAssistantDTO) {
    return await this.assistantService.updated(id, body);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: CreateAssistantDTO) {
    return await this.assistantService.createAssistant(body);
  }

  
  @Post('interaction')
  @HttpCode(HttpStatus.OK)
  async interactWithAssistant(@Body() body: InteractionAssistantDTO) {
    try {
      const response = await this.assistantService.interactWithAssistant(body);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: 'Error interacting with the assistant.' };
    }
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
}
