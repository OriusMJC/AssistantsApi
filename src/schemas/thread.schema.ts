import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Thread {
  @Prop({
    unique: true,
    required: true,
    trim: true,
  })
  threadId: string;

  @Prop({
    required: true,
    trim: true,
  })
  userId: string;

  @Prop({
    required: true,
    trim: true,
  })
  assistantId: string;
}

export const ThreadSchema = SchemaFactory.createForClass(Thread);