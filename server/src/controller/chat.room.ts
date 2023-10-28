/**
 * @file Defines the constants within question service API.
 * @author Irving de Boer
 */
import { Server } from 'socket.io';

export class Room {

  public io: Server;

  public constructor(io: Server) {
    this.io = io;
    this._listenOnRoom();
  }

  private _listenOnRoom() {
    this.io.on('connection', (socket: any) => {
      const roomId = socket.handshake.query.roomId!;
      socket.join(roomId);

      console.log(`User ${socket.id} joined room ${roomId}`);
      socket.on('sendMessage', (message: string) => {
        this._sendMessage(socket, roomId, message);
      });
    });
  }

  private _sendMessage(socket: any, roomId: string | string[], message: string) {
    console.log(`User ${socket.id} sent message ${message} to room ${roomId}`);
    socket.to(roomId).emit('receiveMessage', message);
  }
}
