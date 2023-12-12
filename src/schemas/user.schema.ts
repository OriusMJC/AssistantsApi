import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
  })
  email: string;

  @Prop({
    trim: true,
  })
  GoogleCalendarID: string;

  @Prop({
    required: false,
  })
  AssistantIDs: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);