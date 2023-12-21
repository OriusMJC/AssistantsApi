import { Module } from '@nestjs/common';
import { AssistantService } from './services/assistant.service';
import { AssistantController } from './controllers/assistant.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Assistant, AssistantSchema } from 'src/schemas/assistant.schema';
import { ThreadService } from 'src/thread/services/thread.service';
import { Thread, ThreadSchema } from 'src/schemas/thread.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Calendar, CalendarSchema } from 'src/schemas/calendar.schema';
import { CalendarService } from 'src/calendar/services/calendar.service';
import { UserService } from 'src/user/services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Assistant.name,
        schema: AssistantSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
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
  controllers: [AssistantController],
  providers: [AssistantService, UserService, CalendarService],
})
export class AssistantModule {}
