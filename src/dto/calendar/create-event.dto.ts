import { IsString, IsNotEmpty, IsArray, IsObject, IsBoolean, IsNumber, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class EventDateTime {
  @IsString()
  @IsNotEmpty()
  dateTime: string;

  @IsString()
  @IsNotEmpty()
  timeZone: string;
}

class Attendee {
  @IsString()
  @IsNotEmpty()
  email: string;
}

class ReminderOverride {
  @IsString()
  @IsNotEmpty()
  method: string;

  @IsNumber()
  @IsNotEmpty()
  minutes: number;
}

class Reminders {
  @IsBoolean()
  @IsNotEmpty()
  useDefault: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReminderOverride)
  overrides: ReminderOverride[];
}

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsObject()
  @ValidateNested()
  @Type(() => EventDateTime)
  start: EventDateTime;

  @IsObject()
  @ValidateNested()
  @Type(() => EventDateTime)
  end: EventDateTime;

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  recurrence: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Attendee)
  attendees: Attendee[];

  @IsObject()
  @ValidateNested()
  @Type(() => Reminders)
  reminders: Reminders;
}
