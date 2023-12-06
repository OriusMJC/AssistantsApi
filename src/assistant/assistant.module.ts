import { Module } from '@nestjs/common';
import { AssistantService } from './services/assistant.service';
import { AssistantController } from './controllers/assistant.controller';

@Module({
  imports: [],
  controllers: [AssistantController],
  providers: [AssistantService],
})
export class AssistantModule {}
