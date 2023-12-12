import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Delete,
  Param,
} from '@nestjs/common';
import { ThreadService } from '../services/thread.service';
import { CreateThreadDTO } from 'src/dto/thread/create-thread.dto';

@Controller('thread')
export class ThreadController {
  constructor(private threadService: ThreadService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.threadService.findAll();
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id:string) {
    return this.threadService.findOne(id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id:string) {
    return this.threadService.delete(id);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: CreateThreadDTO) {
    return await this.threadService.createThread(body);
  }
}
