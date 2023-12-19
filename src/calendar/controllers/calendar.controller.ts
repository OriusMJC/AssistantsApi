import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CalendarService } from '../services/calendar.service';
import { CreateEventDto } from 'src/dto/calendar/create-event.dto';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('/oauth2callback')
  async handleOAuth2Callback(@Query('code') code: string) {
    await this.calendarService.handleOAuth2Callback(code);
    console.log("callback")
    return { message: 'Authorization successful' };
  }
  
  @Post('event')
  async createEvent(@Body() event: CreateEventDto) {
    console.log("post event")
    let response = await this.calendarService.createEvent(event);
    return {response: response}
  }

  @Get('')
  async getEvents() {
    let response = await this.calendarService.getEvents();
    console.log("events response: ",response);
    return {response: response}
  }
}


// import { Controller, Get, Post, Req } from '@nestjs/common';
// import { Request } from 'express';
// import { CalendarService } from '../services/calendar.service';

// @Controller('calendar')
// export class CalendarController {
//   constructor(private readonly calendarService: CalendarService) {}

//   @Get()
//   getEvents(@Req() request: Request) {
//     return this.calendarService.getEvents();
//   }

//   @Post()
//   createEvent(@Req() request: Request) {
//     // Aquí iría el código para crear un evento.
//     // Necesitarías extraer la información del evento de la solicitud.
//   }
// }
