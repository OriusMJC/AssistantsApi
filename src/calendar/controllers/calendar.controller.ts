import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { CalendarService } from '../services/calendar.service';
import { CreateEventDto } from 'src/dto/calendar/create-event.dto';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('/oauth2callback')
  async handleOAuth2Callback(@Query('code') code: string) {
    const res = await this.calendarService.handleOAuth2Callback(code);
    return { message: 'Authorization successful', response: res };
  }

  @Post('/token')
  async updateTokenUser(@Query('code') code: string, @Query('userId') userId: string) {
    await this.calendarService.updateUserToken(code, userId);
    return { message: 'Authorization successful' };
  }
  
  @Post('event')
  async createEvent(@Body() event: CreateEventDto) {
    let response = await this.calendarService.createEvent(event);
    return {response: response}
  }

  @Get(':userId')
  async getEvents(@Param('userId') userId:string) {
    let response = await this.calendarService.getEvents(userId);
    return {response: response}
  }
}
