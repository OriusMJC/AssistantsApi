import { IsString, IsOptional, IsNotEmpty } from "class-validator";

export class UpdateAssistantDTO {
  @IsString()
  @IsOptional()
  name?: string; 
  
  @IsString()
  @IsOptional()
  instructions?: string;
  
  @IsString()
  @IsOptional()
  description?: string;
  
  // @IsString()
  // @IsOptional()
  // GoogleCalendarID?: string;
}