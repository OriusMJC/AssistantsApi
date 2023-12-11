import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { DoctorService } from '../services/doctor.service';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly service: DoctorService) {}

  @Get()
  getMati() {
    return 'mati';
  }

  @Post('create')
  @HttpCode(HttpStatus.OK)
  async getHello(@Body() body: any) {
    return await this.service.createDoctor(body);
  }

  // @Post('interaction')
  // @HttpCode(HttpStatus.OK)
  // async interactWithAssistant(@Body() body: any) {
  //   try {
  //     const response = await this.service.interactWithAssistant(body);
  //     return { success: true, data: response };
  //   } catch (error) {
  //     return { success: false, error: 'Error interacting with the assistant.' };
  //   }
  // }
}
