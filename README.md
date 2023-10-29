# PeerPrep Chat Service

Handles the storing retrieving, updating and deleting of questions.

The `docker-compose.yml` file starts 2 Docker containers.

- `chat_service_redis` - NoSQL Database for storing question repository.
- `chat_service_api` - REST API for interacting with the database.

## Table of Contents

- [PeerPrep Chat Service](#peerprep-chat-service)
    - [Quickstart Guide](#quickstart-guide)
    - [Environment Variables](#environment-variables)
        - [Common](#common)
        - [Server](#server)
    - [CHAT SERVER API](#chat-server-api)
        - [Connecting to the Server](#connecting-to-the-server)
        - [Sending Messages](#sending-messages)
        - [Receiving Messages](#receiving-messages)

## Quickstart Guide

1. Clone the repository.
2. Create `.env` file with specified variables. Refer to [Environment Variables](#environment-variables) for a list of
   configs.
3. Run `npm install` to install necessary dependencies.
4. Create and start Docker containers by running command `docker compose up --build -d`.

## Environment Variables

### Common

These environment variables are used by both the API and Redis images.

* `REDIS_HOST` - Docker Host for Redis Server.
* `REDIS_LOCAL_PORT` - Docker Port for Redis Server.
* `REDIS_DOCKER_PORT` - Docker Port for Redis Server.

### Server

* `EXPRESS_DOCKER_PORT` - Docker Port for REST API.
* `EXPRESS_LOCAL_PORT` - Local Port for REST API.
* `USER_SERVICE_HOST` - Hostname of User Service.

## Chat Server API

The server uses Socket.IO to communicate with clients. The Socket.IO library can be found [here](https://socket.io/).
To install the Socket.IO client library for TypeScript, run the following command:

```bash
npm install socket.io-client @types/socket.io-client
```

### Connecting to the Server

The server is hosted on `localhost:3000` by default. By default, the client should connect to the server using websocket
connection. The client passes the room ID as a query parameter when connecting to the server. The room ID is needed to
identify the room that the client is connecting to and its intended recipient. The client can connect to the server
using the following code:

```typescript
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  query: {
    roomId: "room-id",
  },
});
```

### Sending Messages

The client can send messages to the server using the `sendMessage` event. The client should pass the message as a
string.
The server will then broadcast the message to all clients in the room. The client can send messages using the following
code:

```typescript
socket.emit("sendMessage", "Hello World!");
```

### Receiving Messages

The client can receive messages from the server using the `receiveMessage` event. The server will broadcast the message
to
all clients in the room. The client can receive messages using the following code:

```typescript
socket.on("receiveMessage", (message: string) => {
  // display message
  console.log(message);
});
```



