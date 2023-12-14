import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';
import * as readline from 'readline';
import { Calendar } from 'src/schemas/calendar.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CalendarService {
  private readonly SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'];
  private readonly TOKEN_PATH = 'token.json';
  private auth: any;
  
  constructor(@InjectModel(Calendar.name) private calendarModel: Model<Calendar>) {}

  async getEvents() {
    // Load client secrets from a local file.
    fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Calendar API.
      this.authorize(JSON.parse(String(content)), this.listEvents);
    });
  }

  private authorize(credentials, callback) {
    console.log("CREDENCIALS: ", credentials)
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    console.log("AUTH client: ", oAuth2Client)
    // Check if we have previously stored a token.
    fs.readFile(this.TOKEN_PATH, (err, token) => {
      console.log("token err: ", err);
      if (err) return this.getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(String(token)));
      this.auth = oAuth2Client;
      callback.call(this, oAuth2Client);
    });
  }

  private getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', this.TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

  private listEvents(auth) {
    const calendar = google.calendar({version: 'v3', auth});
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const events = res.data.items;
      if (events.length) {
        console.log('Upcoming 10 events:');
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          console.log(`${start} - ${event.summary}`);
        });
      } else {
        console.log('No upcoming events found.');
      }
    });
  }
  async createEvent(event) {
    const calendar = google.calendar({version: 'v3', auth: this.auth});
    const newEvent = {
      calendarId: 'primary',
      resource: event,
    };

    calendar.events.insert(newEvent, (err) => {
      if (err) return console.log('There was an error contacting the Calendar service: ' + err);
      console.log('Event created successfully.');
    });
  }
}


// import { Injectable } from '@nestjs/common';
// import { google } from 'googleapis';
// import * as fs from 'fs';
// import * as readline from 'readline';
// import { Calendar } from 'src/schemas/calendar.schema';
// import { Model } from 'mongoose';
// import { InjectModel } from '@nestjs/mongoose';

// @Injectable()
// export class CalendarService {
//   private readonly SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
//   private readonly TOKEN_PATH = 'token.json';

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

//     // Check if we have previously stored a token.
//     fs.readFile(this.TOKEN_PATH, (err, token) => {
//       if (err) return this.getNewToken(oAuth2Client, callback);
//       oAuth2Client.setCredentials(JSON.parse(String(token)));
//       callback(oAuth2Client);
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
// }
