import { Module } from '@nestjs/common';
import { AssistantService } from './services/assistant.service';
import { AssistantController } from './controllers/assistant.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Assistant, AssistantSchema } from 'src/schemas/assistant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Assistant.name,
        schema: AssistantSchema,
      },
    ]),
  ],
  controllers: [AssistantController],
  providers: [AssistantService],
})
export class AssistantModule {}
