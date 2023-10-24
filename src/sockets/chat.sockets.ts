import { Server } from 'socket.io';

export class SocketController {

  public server;
  public io;

  public constructor(server: any) {
    this.server = server;
    this.io = new Server(this.server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
  }
}
