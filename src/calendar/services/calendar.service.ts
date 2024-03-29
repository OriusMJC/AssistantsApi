import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';

interface IListEventsFilter {
  calendarId?: string,
  timeMin?: string,
  timeMax?: string,
  maxResults?: number,
  singleEvents?: boolean,
  orderBy?: string,
}
@Injectable()
export class CalendarService {
  private readonly SCOPES = ['https://www.googleapis.com/auth/calendar'];
  private auth: OAuth2Client;
  @InjectModel(User.name) private user: Model<User>
  private actualUser: User;

  constructor() {
  }
  
  private async authorize(userId?:string): Promise<OAuth2Client|string> {
    // Check if we have previously stored a token.
    this.actualUser = await this.user.findById(userId)
    const actualUser = this.actualUser
    const credentials = actualUser.GCCredentials
    if(!actualUser) return 'No se pudo encontrar al Usuario'
    if(!actualUser.GCToken?.access_token) return await this.getNewToken();
    try {
      this.auth = new google.auth.OAuth2(credentials.web.client_id, credentials.web.client_secret, credentials.web.redirect_uris[0]);
      const tokenContent = JSON.stringify(actualUser?.GCToken);
      this.auth.setCredentials(JSON.parse(tokenContent));
      
      return this.auth;
    } catch (err) {
      return await this.getNewToken();
    }
  }

  private async getNewToken(): Promise<string> {
    const authUrl = this.auth.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES,
    });

    return authUrl
  }

  async handleOAuth2Callback(code: string): Promise<void | OAuth2Client | string > {
    try {
      console.log('Authorization successful');
      return code;
    } catch (error) {
      console.error('Error retrieving access token', error);
      // Handle the error as needed.
      throw new Error('Error retrieving access token');
    }
  }

  async updateUserToken(code: string, userId:string): Promise<void | OAuth2Client | string > {
    try {
      await this.authorize(userId);
      const token = await this.auth.getToken(code);
      this.auth.setCredentials(token.tokens);

      const actualUser = await this.user.findById(userId);
      actualUser.GCToken = token.tokens;

      await actualUser.save();

      return this.auth;
    } catch (error) {
      console.error('Error retrieving access token', error);
      // Handle the error as needed.
      throw new Error('Error retrieving access token');
    }
  }

  async getEvents(userId?:string, filters?:IListEventsFilter): Promise<any[]|string> {
    try {
      // Authorize a client with credentials, then call the Google Calendar API.
      const authClient = await this.authorize(userId);
      //Si es String retorna el Link para obtener Token
      if(typeof authClient === 'string') return authClient;
      
      //Sino devuelve la lista
      return await this.listEvents(authClient, filters);
    } catch (error) {
      console.error('Error loading client secret file:', error);
      // Handle the error as needed.
      throw new Error('Error loading client secret file');
    }
  }

  private async listEvents(auth: OAuth2Client, filters?: IListEventsFilter): Promise<any[]> {
    const calendar = google.calendar({ version: 'v3', auth });
    const responseEvents = [];
    try {
      let params:IListEventsFilter = {
        calendarId: 'primary',
        timeMin: filters?.timeMin || new Date().toISOString(),
        maxResults: filters?.maxResults || 20,
        singleEvents: filters?.singleEvents || false,
      };
      if(filters?.timeMax){
        params.timeMax = filters.timeMax;
      }
      
      const res = await calendar.events.list(params);

      const events = res.data.items;
      if (events.length) {
        console.log('Upcoming 10 events:');
        events.forEach((event) => {
          const start = event.start.dateTime || event.start.date;
          console.log(`${start} - ${event.summary}`);
          responseEvents.push(event);
        });
      } else {
        console.log('No upcoming events found.');
      }
    } catch (error) {
      if (error.code === '400') {
        auth.refreshAccessToken((err, tokens) => {
          if (err) {
            console.error('Error al refrescar el token:', err);
            throw err;
          }
          auth.setCredentials(tokens);
          return this.listEvents(auth, filters);
        });
      } else {
        console.error('La API devolvió un error:', error);
        throw new Error('Error al llamar a la API de Google Calendar');
      }
    }

    return responseEvents;
  }

  async createEvent(event, userId:string): Promise<void> {
    await this.authorize(userId);
    const calendar = google.calendar({ version: 'v3', auth: this.auth });
    const newEvent = {
      calendarId: 'primary',
      resource: event,
    };
    return await calendar.events.insert(newEvent, (err) => {
      if (err) {
        throw new Error('Error contacting the Calendar service');
      }
      return newEvent;
    });
  }
}
