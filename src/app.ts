import express, { Application } from 'express';
import {createServer} from 'http';
import { Server } from 'socket.io';
import { Room } from './controller/chat.room';


class App {
  public app: Application;
  public server;
  public io;

  public constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: '*',
      }
    })
    this._setController();
  }

  private _setController() {
    this.app.get('/', (req, res) => {
      res.send('PeerPrep Chat Service');
    });

    new Room(this.io);
  }

}

export default new App().server;
