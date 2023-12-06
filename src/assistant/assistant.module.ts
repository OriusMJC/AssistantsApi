import { Module, forwardRef } from '@nestjs/common';
import { AssistantService } from './services/assistant.service';
import { AssistantController } from './controllers/assistant.controller';
import { commonModule } from 'src/common/common.module';

@Module({
    imports: [
        forwardRef(() => commonModule),
    ],
    controllers: [
        AssistantController
    ],
    providers: [
        AssistantService
    ],
})
export class AssistantModule { }
