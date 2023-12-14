import { Controller, Get, Post, Body } from '@nestjs/common';
import { CalendarService } from '../services/calendar.service';
import { CreateEventDto } from 'src/dto/calendar/create-event.dto';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('event')
  async createEvent(@Body() event: CreateEventDto) {
    await this.calendarService.createEvent(event);
  }

  @Get('events')
  async getEvents() {
    return this.calendarService.getEvents();
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
