import { IsString, IsOptional, IsNotEmpty } from "class-validator";

export class CreateAssistantDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsString()
  @IsOptional()
  instructions?: string;
  
  @IsString()
  @IsOptional()
  description?: string;
  
  @IsString()
  @IsNotEmpty()
  GoogleCalendarID: string;
  
  @IsString()
  @IsNotEmpty()
  userId: string;
}