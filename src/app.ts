import express, { Application } from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import { SocketController } from './sockets/chat.sockets';

class App {
  public app: Application;

  public constructor() {
    this.app = express();
    this._setController();
    this._setSocketIoConfig()
  }

  private _setController() {
    this.app.use('/', (req, res) => {
      res.send('PeerPrep Chat Service');
    });
  }

  private _setSocketIoConfig() {
    const server = http.createServer(this.app);
    const socketController = new SocketController(server);
  }

}

export default new App().app;
