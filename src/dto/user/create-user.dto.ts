import { IsString, IsOptional, IsNotEmpty, IsEmail, IsArray, IsJSON } from "class-validator";

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsEmail()
  @IsNotEmpty()
  email?: string;
  
  // @IsJSON()
  @IsNotEmpty()
  GCCredentials: {
    web: {
      client_id: string,
      project_id: string,
      auth_uri: string,
      token_uri: string,
      auth_provider_x509_cert_url: string,
      client_secret: string,
      redirect_uris: string[],
      javascript_origins: string[]
    }
  };
  
  // @IsJSON()
  @IsOptional()
  GCToken: {
    access_token: string,
    refresh_token: string,
    scope: string,
    token_type: string,
    expiry_date: number
  };

  @IsArray()
  @IsOptional()
  AssistantIDs: string[];
}