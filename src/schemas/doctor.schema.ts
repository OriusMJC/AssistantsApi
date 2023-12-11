import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Doctor {
  @Prop({
    unique: true,
    required: true,
    trim: true,
  })
  id: string;

  @Prop({
    unique: true,
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    trim: true,
  })
  description: string;

  @Prop({
    required: true,
  })
  AssistantIDs: string[];
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);