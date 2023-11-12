/**
 * @file Manages the configuration settings for Socket IO API.
 * @author Irving de Boer
 */
import { createAdapter } from '@socket.io/redis-streams-adapter';
import * as dotenv from 'dotenv';
import express, { Application } from 'express';
import { createServer } from 'http';
import { createClient } from 'redis';
import { Server } from 'socket.io';

import { Room } from './controller/chat.room';
import { ChatDatabase } from './database/chat.database';
import { RoomEvent } from './interfaces/chat.interfaces';
import RoomServiceMqConsumer from './mq/chat.mq';

dotenv.config();

class App {
  public app: Application;
  public server;
  public io;
  private _redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_DOCKER_PORT}`,
  });
  private _redisDatabase;

  public constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this._setRedisConnect();

    this.io = new Server(this.server, {
      adapter: createAdapter(this._redisClient),
      cors: {
        origin: '*',
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
      exchangeName: process.env.MQ_EXCHANGE_NAME!,
      host: process.env.MQ_HOST!,
      password: process.env.MQ_PASSWORD!,
      port: Number(process.env.MQ_PORT!),
      queueName: 'chat-service-room-event-queue',
      shouldUseTls: false,
      user: process.env.MQ_USER!,
      vhost: process.env.MQ_VHOST!,
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
