import { Module, forwardRef } from '@nestjs/common';
import { AccessModule } from './access/access.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { AppGuard } from './access/guards/app.guard';
import { AssistantModule } from './assistant/assistant.module';
import { UserModule } from './user/user.module';
import { ThreadModule } from './thread/thread.module';
import { CalendarModule } from './calendar/calendar.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    forwardRef(() => AccessModule),
    forwardRef(() => AssistantModule),
    forwardRef(() => UserModule),
    forwardRef(() => ThreadModule),
    forwardRef(() => CalendarModule),
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: AppGuard }],
})
export class AppModule {}
