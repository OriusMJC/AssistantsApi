import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Calendar extends Document {
  @Prop({
    unique: true,
    required: true,
    trim: true,
  })
  GoogleCalendarID: string;

  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
  })
  userId: string;
}

export const CalendarSchema = SchemaFactory.createForClass(Calendar);
