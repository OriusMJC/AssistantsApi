import { Module } from '@nestjs/common';
import { AssistantService } from './services/assistant.service';
import { AssistantController } from './controllers/assistant.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Assistant, AssistantSchema } from 'src/schemas/assistant.schema';
import { ThreadService } from 'src/thread/services/thread.service';
import { Thread, ThreadSchema } from 'src/schemas/thread.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Assistant.name,
        schema: AssistantSchema,
      },
      // {
      //   name: Thread.name,
      //   schema: ThreadSchema,
      // },
    ]),
  ],
  controllers: [AssistantController],
  providers: [AssistantService],
})
export class AssistantModule {}
