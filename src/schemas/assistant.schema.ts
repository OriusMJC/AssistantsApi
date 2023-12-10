import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Assistant {
  @Prop({
    unique: true,
    required: true,
    trim: true,
  })
  id: string;

  @Prop({
    trim: true,
  })
  description: string;

  @Prop({
    unique: true,
    required: true,
    trim: true,
  })
  userId: string;
}

export const AssistantSchema = SchemaFactory.createForClass(Assistant);