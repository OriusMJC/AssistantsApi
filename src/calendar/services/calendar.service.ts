// import { Injectable } from '@nestjs/common';
// import { google } from 'googleapis';
// import * as fs from 'fs';
// import * as readline from 'readline';

// @Injectable()
// export class CalendarService {
//   private readonly SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'];
//   private readonly TOKEN_PATH = 'token.json';
//   private auth: any;

//   async getEvents() {
//     try {
//       const content = await fs.promises.readFile('credentials.json');
//       const credentials = JSON.parse(content.toString());
//       const auth = await this.authorize(credentials);
//       await this.listEvents(auth);
//     } catch (err) {
//       console.error('Error loading client secret file:', err);
//     }
//   }

//   private async authorize(credentials): Promise<any> {
//     const { client_secret, client_id, redirect_uris } = credentials.web;
//     const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

//     const token = await this.getTokenFromFile(oAuth2Client);
//     oAuth2Client.setCredentials(token);
//     this.auth = oAuth2Client;
//     return oAuth2Client;
//   }

//   private async getTokenFromFile(oAuth2Client): Promise<any> {
//     try {
//       const token = await fs.promises.readFile(this.TOKEN_PATH);
//       return JSON.parse(token.toString());
//     } catch (err) {
//       return this.getNewToken(oAuth2Client);
//     }
//   }

//   private async getNewToken(oAuth2Client): Promise<any> {
//     const authUrl = oAuth2Client.generateAuthUrl({
//       access_type: 'offline',
//       scope: this.SCOPES,
//     });
//     console.log('Authorize this app by visiting this url:', authUrl);

//     const code = await this.promptCode();
//     const token = await oAuth2Client.getToken(code);
//     await fs.promises.writeFile(this.TOKEN_PATH, JSON.stringify(token.tokens));
//     oAuth2Client.setCredentials(token.tokens);

//     return token.tokens;
//   }

//   private async promptCode(): Promise<string> {
//     const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });

//     return new Promise<string>((resolve) => {
//       rl.question('Enter the code from that page here: ', (code) => {
//         rl.close();
//         resolve(code);
//       });
//     });
//   }

//   private async listEvents(auth): Promise<void> {
//     const calendar = google.calendar({ version: 'v3', auth });
//     const res = await calendar.events.list({
//       calendarId: 'primary',
//       timeMin: new Date().toISOString(),
//       maxResults: 10,
//       singleEvents: true,
//       orderBy: 'startTime',
//     });

//     const events = res.data.items;
//     if (!events || events.length === 0) {
//       console.log('No upcoming events found.');
//       return;
//     }

//     console.log('Upcoming 10 events:');
//     events.forEach((event, i) => {
//       const start = event.start.dateTime || event.start.date;
//       console.log(`${start} - ${event.summary}`);
//     });
//   }

//   async handleOAuth2Callback(code: string): Promise<void> {
//     const oAuth2Client = await this.authorize(JSON.parse(fs.readFileSync('credentials.json').toString()));
//     const token = await oAuth2Client.getToken(code);
//     oAuth2Client.setCredentials(token.tokens);

//     // Guarda el token en el archivo
//     await fs.promises.writeFile(this.TOKEN_PATH, JSON.stringify(token.tokens));

//     // Puedes realizar acciones adicionales aquí si es necesario

//     console.log('Authorization successful');
//   }
// }


// =========================


// import { Injectable } from '@nestjs/common';
// import { google } from 'googleapis';
// import * as fs from 'fs';
// import * as readline from 'readline';
// import { Calendar } from 'src/schemas/calendar.schema';
// import { Model } from 'mongoose';
// import { InjectModel } from '@nestjs/mongoose';
// import { OAuth2Client } from 'google-auth-library';


// @Injectable()
// export class CalendarService {
//   private readonly calendar = google.calendar('v3');
//   // private readonly SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'];
//   private readonly SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
//   private readonly TOKEN_PATH = 'token.json';
//   // private auth: any;
//   private auth: OAuth2Client;
  
//   constructor(@InjectModel(Calendar.name) private calendarModel: Model<Calendar>) {}

//   async getEvents() {
//     // Load client secrets from a local file.
//     fs.readFile('credentials.json', (err, content) => {
//       if (err) return console.log('Error loading client secret file:', err);
//       // Authorize a client with credentials, then call the Google Calendar API.
//       this.authorize(JSON.parse(String(content)), this.listEvents);
//     });
//   }

//   private authorize(credentials, callback) {
//     console.log("CREDENCIALS: ", credentials)
//     const {client_secret, client_id, redirect_uris} = credentials.web;
//     const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
//     console.log("AUTH client: ", oAuth2Client)
//     // Check if we have previously stored a token.
//     fs.readFile(this.TOKEN_PATH, (err, token) => {
//       console.log("token err: ", err);
//       if (err) return this.getNewToken(oAuth2Client, callback);
//       oAuth2Client.setCredentials(JSON.parse(String(token)));
//       this.auth = oAuth2Client;
//       callback.call(this, oAuth2Client);
//     });
//   }

//   private getNewToken(oAuth2Client, callback) {
//     const authUrl = oAuth2Client.generateAuthUrl({
//       access_type: 'offline',
//       scope: this.SCOPES,
//     });
//     console.log('Authorize this app by visiting this url:', authUrl);
//     const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
//     rl.question('Enter the code from that page here: ', (code) => {
//       rl.close();
//       oAuth2Client.getToken(code, (err, token) => {
//         if (err) return console.error('Error retrieving access token', err);
//         oAuth2Client.setCredentials(token);
//         // Store the token to disk for later program executions
//         fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), (err) => {
//           if (err) return console.error(err);
//           console.log('Token stored to', this.TOKEN_PATH);
//         });
//         callback(oAuth2Client);
//       });
//     });
//   }

//   private listEvents(auth) {
//     const calendar = google.calendar({version: 'v3', auth});
//     calendar.events.list({
//       calendarId: 'primary',
//       timeMin: (new Date()).toISOString(),
//       maxResults: 10,
//       singleEvents: true,
//       orderBy: 'startTime',
//     }, (err, res) => {
//       if (err) return console.log('The API returned an error: ' + err);
//       const events = res.data.items;
//       if (events.length) {
//         console.log('Upcoming 10 events:');
//         events.map((event, i) => {
//           const start = event.start.dateTime || event.start.date;
//           console.log(`${start} - ${event.summary}`);
//         });
//       } else {
//         console.log('No upcoming events found.');
//       }
//     });
//   }
//   async createEvent(event) {
//     const calendar = google.calendar({version: 'v3', auth: this.auth});
//     const newEvent = {
//       calendarId: 'primary',
//       resource: event,
//     };

//     calendar.events.insert(newEvent, (err) => {
//       if (err) return console.log('There was an error contacting the Calendar service: ' + err);
//       console.log('Event created successfully.');
//     });
//   }
// }


// -----------------------------------

import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';
import * as readline from 'readline';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class CalendarService {
  private readonly SCOPES = ['https://www.googleapis.com/auth/calendar'];
  private readonly TOKEN_PATH = 'token.json';
  private auth: OAuth2Client;

  constructor() {
    // Load client secrets from a local file.
    const content = fs.readFileSync('credentials.json', 'utf-8');
    const credentials = JSON.parse(content);
    this.auth = new google.auth.OAuth2(credentials.web.client_id, credentials.web.client_secret, credentials.web.redirect_uris[0]);
  }

  private async authorize(): Promise<OAuth2Client> {
    // Check if we have previously stored a token.
    try {
      const tokenContent = fs.readFileSync(this.TOKEN_PATH, 'utf-8');
      this.auth.setCredentials(JSON.parse(tokenContent));
      return this.auth;
    } catch (err) {
      return await this.getNewToken();
    }
  }

  private async getNewToken(): Promise<OAuth2Client> {
    const authUrl = this.auth.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES,
    });

    console.log('Authorize this app by visiting this url:', authUrl);
    const code = await this.promptForCode();
    const token = await this.auth.getToken(code);
    this.auth.setCredentials(token.tokens);

    // Store the token to disk for later program executions
    fs.writeFileSync(this.TOKEN_PATH, JSON.stringify(token.tokens));

    return this.auth;
  }

  private async promptForCode(): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        resolve(code);
      });
    });
  }

  async getEvents(): Promise<any[]> {
    try {
      // Authorize a client with credentials, then call the Google Calendar API.
      const authClient = await this.authorize();
      return await this.listEvents(authClient);
    } catch (error) {
      console.error('Error loading client secret file:', error);
      // Handle the error as needed.
      throw new Error('Error loading client secret file');
    }
  }

  private async listEvents(auth: OAuth2Client): Promise<any[]> {
    const calendar = google.calendar({ version: 'v3', auth });
    const responseEvents = [];

    try {
      const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      });

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
      console.error('The API returned an error:', error);
      // Handle the error as needed.
      throw new Error('Error calling Google Calendar API');
    }

    return responseEvents;
  }

  async handleOAuth2Callback(code: string): Promise<void> {
    try {
      const token = await this.auth.getToken(code);
      this.auth.setCredentials(token.tokens);

      // Store the token to disk for later program executions
      fs.writeFileSync(this.TOKEN_PATH, JSON.stringify(token.tokens));

      // Puedes realizar acciones adicionales aquí si es necesario
      console.log('Authorization successful');
    } catch (error) {
      console.error('Error retrieving access token', error);
      // Handle the error as needed.
      throw new Error('Error retrieving access token');
    }
  }

  async createEvent(event): Promise<void> {
    const calendar = google.calendar({ version: 'v3', auth: this.auth });
    const newEvent = {
      calendarId: 'primary',
      resource: event,
    };

    return await calendar.events.insert(newEvent, (err) => {
      if (err) {
        console.error('There was an error contacting the Calendar service:', err);
        // Handle the error as needed.
        throw new Error('Error contacting the Calendar service');
      }
      console.log('Event created successfully.');
      return 'Event created successfully.';
    });
  }
}



//------------------------------------------------


// import { Injectable } from '@nestjs/common';
// import { google, Auth } from 'googleapis';
// import * as fs from 'fs';
// import * as readline from 'readline';
// import { Calendar } from 'src/schemas/calendar.schema';
// import { Model } from 'mongoose';
// import { InjectModel } from '@nestjs/mongoose';

// @Injectable()
// export class CalendarService {
//   private readonly SCOPES = ['https://www.googleapis.com/auth/calendar'];
//   private readonly TOKEN_PATH = 'token.json';

//   constructor(@InjectModel(Calendar.name) private calendarModel: Model<Calendar>) {}

//   async getEvents() {
//     try {
//       const content = await fs.promises.readFile('credentials.json');
//       const credentials = JSON.parse(content.toString());
//       const auth = await this.authorize(credentials);
//       await this.listEvents(auth);
//     } catch (err) {
//       console.error('Error loading client secret file:', err);
//     }
//   }

//   private async authorize(credentials): Promise<Auth.OAuth2Client> {
//     console.log("CREDENTIALS: ", credentials);
//     const { client_secret, client_id, redirect_uris } = credentials.web;
//     const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

//     return new Promise((resolve, reject) => {
//       // Check if we have previously stored a token.
//       fs.readFile(this.TOKEN_PATH, (err, token) => {
//         if (err) {
//           reject(this.getNewToken(oAuth2Client));
//         } else {
//           oAuth2Client.setCredentials(JSON.parse(String(token)));
//           resolve(oAuth2Client);
//         }
//       });
//     });
//   }

//   private async getNewToken(oAuth2Client): Promise<Auth.OAuth2Client> {
//     return new Promise((resolve, reject) => {
//       const authUrl = oAuth2Client.generateAuthUrl({
//         access_type: 'offline',
//         scope: this.SCOPES,
//       });
//       console.log('Authorize this app by visiting this url:', authUrl);
  
//       const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout,
//       });
  
//       rl.question('Enter the code from that page here: ', (code) => {
//         rl.close();
//         oAuth2Client.getToken(code, (err: any, token) => {
//           if (err) {
//             console.error('Error retrieving access token', err);
//             reject(err);
//           }
//           fs.promises.writeFile(this.TOKEN_PATH, JSON.stringify(token), { encoding: 'utf-8' })
//             .then(() => {
//               console.log('Token stored to', this.TOKEN_PATH);
//               resolve(oAuth2Client);
//             })
//             .catch((err) => {
//               console.error(err);
//               reject(err);
//             });
//         });
//       });
//     });
//   }
  

//   private async listEvents(auth: Auth.OAuth2Client): Promise<void> {
//     const calendar = google.calendar({ version: 'v3', auth });
//     const res = await calendar.events.list({
//       calendarId: 'primary',
//       timeMin: new Date().toISOString(),
//       maxResults: 10,
//       singleEvents: true,
//       orderBy: 'startTime',
//     });

//     const events = res.data.items;
//     if (!events || events.length === 0) {
//       console.log('No upcoming events found.');
//       return;
//     }

//     console.log('Upcoming 10 events:');
//     events.forEach((event, i) => {
//       const start = event.start.dateTime || event.start.date;
//       console.log(`${start} - ${event.summary}`);
//     });
//   }

//   async handleOAuth2Callback(code: string): Promise<void> {
//     const credentials = JSON.parse(fs.readFileSync('credentials.json').toString());
//     const oAuth2Client = await this.authorize(credentials);
//     const token = await oAuth2Client.getToken(code);
//     oAuth2Client.setCredentials(token.tokens);

//     // Guarda el token en el archivo
//     await fs.promises.writeFile(this.TOKEN_PATH, JSON.stringify(token.tokens));

//     // Puedes realizar acciones adicionales aquí si es necesario

//     console.log('Authorization successful');
//   }
// }

