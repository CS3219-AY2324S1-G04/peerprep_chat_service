/**
 * @file Manages the configuration settings for Socket IO API.
 * @author Irving de Boer
 */
import { createAdapter } from '@socket.io/redis-streams-adapter';
import express, { Application } from 'express';
import { createServer } from 'http';
import { createClient } from 'redis';
import { Server } from 'socket.io';

import {
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_SHOULD_USE_TLS,
  REDIS_USERNAME,
  ROOM_SERVICE_MQ_EXCHANGE_NAME,
  ROOM_SERVICE_MQ_HOST,
  ROOM_SERVICE_MQ_PASSWORD,
  ROOM_SERVICE_MQ_PORT,
  ROOM_SERVICE_MQ_QUEUE_NAME,
  ROOM_SERVICE_MQ_SHOULD_USE_TLS,
  ROOM_SERVICE_MQ_USER,
  ROOM_SERVICE_MQ_VHOST,
} from './constants/chat.constants';
import { Room } from './controller/chat.room';
import { ChatDatabase } from './database/chat.database';
import { RoomEvent } from './interfaces/chat.interfaces';
import RoomServiceMqConsumer from './mq/chat.mq';

class App {
  public app: Application;
  public server;
  public io;
  private _redisClient = createClient({
    url: `redis://${encodeURIComponent(REDIS_USERNAME)}:${encodeURIComponent(
      REDIS_PASSWORD,
    )}@${REDIS_HOST}:${REDIS_PORT}`,
    socket: { tls: REDIS_SHOULD_USE_TLS },
  });
  private _redisDatabase;

  public constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this._setRedisConnect();

    this.io = new Server(this.server, {
      adapter: createAdapter(this._redisClient),
      cors: {
        origin: new RegExp('http://localhost:[0-9]+'),
      },
      path: '/chat-service',
    });
    this._redisDatabase = new ChatDatabase(this._redisClient);
    this._setController();
  }

  private async _setController() {
    this.app.get('/', (req, res) => {
      res.send('PeerPrep Chat Service');
    });

    new Room(this.io, this._redisDatabase);

    await this._consumeMessages();
  }

  private async _setRedisConnect() {
    await this._redisClient.connect();
  }

  private async _consumeMessages() {
    const consumer: RoomServiceMqConsumer = new RoomServiceMqConsumer({
      user: ROOM_SERVICE_MQ_USER,
      password: ROOM_SERVICE_MQ_PASSWORD,
      host: ROOM_SERVICE_MQ_HOST,
      port: Number(ROOM_SERVICE_MQ_PORT),
      vhost: ROOM_SERVICE_MQ_VHOST,
      shouldUseTls: ROOM_SERVICE_MQ_SHOULD_USE_TLS,
      exchangeName: ROOM_SERVICE_MQ_EXCHANGE_NAME,
      queueName: ROOM_SERVICE_MQ_QUEUE_NAME,
    });

    await consumer.initialise();
    console.log('Initialised');

    await consumer.consume(async (data: RoomEvent) => {
      console.log(`Received: ${JSON.stringify(data)}`);
      await this._handleRoomEvent(data);
    });
  }

  private async _handleRoomEvent(data: RoomEvent) {
    const roomId = data.room.roomId;
    const userIds = data.room.userIds.map(String);

    switch (data.eventType) {
      case 'create':
        console.log('create');
        await this._redisDatabase.addUsers(roomId, userIds);
        break;
      case 'delete':
        console.log('delete');
        await this._redisDatabase.deleteRoom(roomId);
        break;
      case 'remove-user':
        console.log('remove-user');
        await this._redisDatabase.removeUsers(roomId, userIds);
        break;
    }
  }
}

export default new App().server;
