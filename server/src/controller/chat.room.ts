/**
 * @file Defines the constants within question service API.
 * @author Irving de Boer
 */
import { Server } from 'socket.io';

import { ConnectionQuery, MessagePayload } from '../interfaces/chat.interfaces';

export class Room {
  public io: Server;

  public constructor(io: Server) {
    this.io = io;
    this._listenOnRoom();
  }
  private _listenOnRoom() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.io.on('connection', (socket: any) => {
      const connectionQuery: ConnectionQuery = socket.handshake.query;

      const roomId = connectionQuery.roomId!;
      const userId = connectionQuery.userId!;
      const userName = connectionQuery.userName!;

      if (!roomId || !userId || !userName) {
        console.log('Missing connection query parameters');
        socket.disconnect();
      }

      this._joinedRoom(socket, roomId, userName);
      this._sendMessage(socket, roomId, userName);
      this._leaveRoom(socket, roomId, userName);
    });
  }

  private _joinedRoom(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket: any,
    roomId: string | string[],
    userName: string,
  ) {
    console.log(`User ${userName} joined room ${roomId}`);
    const joinedRoomMessage = `User ${userName} joined the chat`;
    socket.join(roomId);
    socket.to(roomId).emit('joinRoom', joinedRoomMessage);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _leaveRoom(socket: any, roomId: string | string[], userName: string) {
    socket.on('disconnect', () => {
      const disconnectedMessage = `User ${userName} left the chat`;
      console.log(`User ${userName} disconnected`);
      socket.to(roomId).emit('leftRoom', disconnectedMessage);
    });
  }

  private _sendMessage(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket: any,
    roomId: string | string[],
    userName: string,
  ) {
    socket.on('sendMessage', (message: string) => {
      console.log(`User ${userName} sent message ${message} to room ${roomId}`);

      const messagePayload: MessagePayload = {
        message,
        userName,
      };
      socket.to(roomId).emit('receiveMessage', messagePayload);
    });
  }
}
