import { IsString, IsOptional, IsNotEmpty } from "class-validator";

export class InteractionAssistantDTO {
  @IsString()
  @IsNotEmpty()
  assistantId: string; 

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