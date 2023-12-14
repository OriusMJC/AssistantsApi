import { IsString, IsOptional, IsNotEmpty } from "class-validator";

export class InteractionCalendarDTO {
  @IsString()
  @IsNotEmpty()
  calendarId: string; 

  @IsString()
  @IsNotEmpty()
  userId: string; 

  @IsString()
  @IsNotEmpty()
  message: string; 
  
  @IsString()
  @IsOptional()
  threadId?: string;
}
