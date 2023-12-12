import { IsString, IsOptional, IsNotEmpty, IsEmail, IsArray } from "class-validator";

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  name: string;
  
  @IsEmail()
  @IsOptional()
  email?: string;
  
  @IsString()
  @IsOptional()
  GoogleCalendarID: string;
  
  @IsArray()
  @IsOptional()
  AssistantIDs: string[];
}