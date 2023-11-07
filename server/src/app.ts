/**
 * @file Manages the configuration settings for Socket IO API.
 * @author Irving de Boer
 */
import express, { Application } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Room } from './controller/chat.room';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-streams-adapter';
import * as dotenv from 'dotenv';
import { MessageController } from './controller/chat.mq';

dotenv.config();

class App {
  public app: Application;
  public server;
  public io;
  private _messageQueueController;
  private _redisClient = createClient({ url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_DOCKER_PORT}` });

  public constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this._setRedisConnect();
    this.io = new Server(this.server, {
      adapter: createAdapter(this._redisClient),
      cors: {
        origin: '*',
      }
    })
    this._messageQueueController = new MessageController();
    this._setController();
  }

  private _setController() {
    this.app.get('/', (req, res) => {
      res.send('PeerPrep Chat Service');
    });

    this.app.use('/chat-service')

    new Room(this.io);
  }

  private async _setRedisConnect() {
    await this._redisClient.connect();
  }
}

export default new App().server;
