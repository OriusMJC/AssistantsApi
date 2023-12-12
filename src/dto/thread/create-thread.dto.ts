import { IsString, IsNotEmpty } from "class-validator";

export class CreateThreadDTO {
  @IsString()
  @IsNotEmpty()
  threadId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  assistantId: string;
}