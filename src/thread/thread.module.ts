import { Module } from '@nestjs/common';
import { ThreadService } from './services/thread.service';
import { ThreadController } from './controllers/thread.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Thread, ThreadSchema } from 'src/schemas/thread.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Thread.name,
        schema: ThreadSchema,
      },
    ]),
  ],
  controllers: [ThreadController],
  providers: [ThreadService],
})
export class ThreadModule {}