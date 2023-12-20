import { Module } from '@nestjs/common';
import { CalendarService } from './services/calendar.service';
import { CalendarController } from './controllers/calendar.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Calendar, CalendarSchema } from 'src/schemas/calendar.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserService } from 'src/user/services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Calendar.name,
        schema: CalendarSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [CalendarController],
  providers: [CalendarService, UserService],
})
export class CalendarModule {}
