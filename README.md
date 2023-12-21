<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## Assistant

### Crear un asistente

❗Tienes que tener un usuario Doctor creado

**POST** a ```/assistant```
ejemplo de body:

```
{
	"name": "Nombre del asistente",
	"instructions": "Prompt adicional",
	"userId": "ID del usuario"
}
```

Ten en cuenta que el asistente ya está creado con un Prompt Main el cual es suficiente para funcionar con los servicios del Calendario. Esto es simplemente por si se le quiere añadir información extra o darle alguna personalidad.

### Interactuar con el Asistente

❗Tienes que tener un usuario Doctor y asistente creado


❗En el primer mensaje no es necesario tener el ID del Hilo de conversacion, pero si se quiere mantener la conversacion, en los siguientes post es necesario pasarle el ID del Hilo (threadId)

El hilo de conversación se obtiene en la respuesta del Primer mensaje.

**POST** a ```/assistant/interaction```

ejemplo de body:

```
{
	"assistantId": "ID del asistente",
	"message": "mensaje para el asistente",
	"userId": "ID del usuario",
	"threadId": "ID del Hilo de conversación"
}
```

una vez hecho el **POST** es necesario hacer el siguiente **GET** ```Listar la conversación entera``` para obtener la conversación y que en caso de haber pedido una accion como la de Agendar una cita, la acción se cumpla.


### Listar la conversación entera 

❗Tienes que tener el ID del hilo de conversación


El hilo de conversación se obtiene en la respuesta del Primer mensaje.

**GET** a ```/assistant/list/:threadId/:userId```

Tienes que reemplazar ```threadId``` y ```userId``` por los valores correspondientes.


### Obtener todos los asistentes o uno específico

**GET** a ```/assistant```
**GET** a ```/assistant/:assistantId``` 

❗ID del asistente no obligatorio




## Calendar: 

### GET Calendar:

**GET** a ``` /calendar/:userId ```

si es la primera vez que el usuario Doctor hace peticion del Calendar significa que no tiene el Totke. Si no tenes el token de Calendar activado entonces ese Endpoint te devuelve un **URL**

entras a la **URL** y aceptas los permisos con tu cuenta de Google. 

Eso devolverá un codigo el cual tienes que insertar en un **POST** a:
``` /calendar/token?userId={userID}&code={codigo} ``` y esto guardará el Token.

Ahora puedes hacer un **GET** a ``` /calendar/:userId ``` y te devolverá la lista de eventos del Doctor usuario.

### POST Event

Para postear un Evento haz un **POST** a ``` /calendar/event/:userId ``` y este un ejemplo del **JSON** que hay que enviar por **BODY**:

```
{
  "summary": "Reunión de prueba 3",
  "location": "Buenos Aires, Argentina",
  "description": "Esta es una reunión de prueba creada desde la API de Google Calendar.",
  "start": {
    "dateTime": "2023-12-29T10:00:00-03:00",
    "timeZone": "America/Argentina/Buenos_Aires"
  },
  "end": {
    "dateTime": "2023-12-29T11:00:00-03:00",
    "timeZone": "America/Argentina/Buenos_Aires"
  },
  "attendees": [
    {
      "email": "matiasjesuscontreras12@gmail.com"
    },
		{
      "email": "angelvegaxdpro08@gmail.com"
    }
  ],
  "reminders": {
    "useDefault": false,
    "overrides": [
      {
        "method": "email",
        "minutes": 5
      },
      {
        "method": "popup",
        "minutes": 10
      }
    ]
  }
}
```