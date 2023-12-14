import { Module } from '@nestjs/common';
import { CalendarService } from './services/calendar.service';
import { CalendarController } from './controllers/calendar.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Calendar, CalendarSchema } from 'src/schemas/calendar.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Calendar.name,
        schema: CalendarSchema,
      },
      // {
      //   name: Thread.name,
      //   schema: ThreadSchema,
      // },
    ]),
  ],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
