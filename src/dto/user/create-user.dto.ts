import { IsString, IsOptional, IsNotEmpty, IsEmail, IsArray } from "class-validator";

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsEmail()
  @IsNotEmpty()
  email?: string;
  
  @IsString()
  @IsOptional()
  GoogleCalendarID: string;
  
  @IsArray()
  @IsOptional()
  AssistantIDs: string[];
}