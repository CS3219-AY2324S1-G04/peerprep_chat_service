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
      const userId = socket.handshake.query.userId!;

      this._joinedRoom(socket, roomId, userId);

      this._leaveRoom(socket, roomId, userId);

      this._sendMessage(socket, roomId, userId);
    });
  }


  private _joinedRoom(socket: any, roomId: string | string[], userId: string) {
    console.log(`User ${userId} joined room ${roomId}`);
    const joinedRoomMessage = `User ${userId} joined the chat`;
    socket.join(roomId);
    socket.to(roomId).emit('joinedRoom', joinedRoomMessage);
  }

  private _leaveRoom(socket: any, roomId: string | string[], userId: string) {
    socket.on('disconnect', (socket: any) => {

      const disconnectedMessage = `User ${userId} left the chat`;
      console.log(`User ${userId} disconnected`);
      socket.to(roomId).emit('leftRoom', disconnectedMessage);
    });
  }

  private _sendMessage(socket: any, roomId: string | string[], message: string) {
    console.log(`User ${socket.id} sent message ${message} to room ${roomId}`);
    socket.on('sendMessage', (message: string) => {
      socket.to(roomId).emit('receiveMessage', message);
    });
  }


}
