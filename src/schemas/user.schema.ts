import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
    type: Object
  })
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
  }

  @Prop({
    type: Object,
  })
  GCToken: {
    access_token: string,
    refresh_token: string,
    scope: string,
    token_type: string,
    expiry_date: number
  } | any

  @Prop({
    required: false,
  })
  AssistantIDs: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);