/**
 * @file Defines the constants within question service API.
 * @author Irving de Boer
 */
import { Server } from 'socket.io';
import { MessageController } from './chat.mq';

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
      this._sendMessage(socket, roomId, userId);
      this._leaveRoom(socket, roomId, userId);
    });
  }


  private _joinedRoom(socket: any, roomId: string | string[], userId: string) {
    console.log(`User ${userId} joined room ${roomId}`);
    const joinedRoomMessage = `User ${userId} joined the chat`;
    socket.join(roomId);

    const joinedRoomPayload: MessagePayload = {
      userId: userId,
      message: joinedRoomMessage,
      timestamp: new Date(),
    }

    socket.to(roomId).emit('joinRoom', joinedRoomPayload);
  }

  private _leaveRoom(socket: any, roomId: string | string[], userId: string) {
    socket.on('disconnect', () => {
      const disconnectedMessage = `User ${userId} left the chat`;
      console.log(`User ${userId} disconnected`);

      const disconnectedPayload: MessagePayload = {
        userId: userId,
        message: disconnectedMessage,
        timestamp: new Date(),
      }
      socket.to(roomId).emit('leftRoom', disconnectedPayload);
    });
  }

  private _sendMessage(socket: any, roomId: string | string[], userId: string) {
    socket.on('sendMessage', (incomingMessage: MessagePayload) => {
      console.log(`User ${userId} sent message ${incomingMessage.message} to room ${roomId}`);

      const outgoingMessage: MessagePayload = {
        userId: userId,
        message: incomingMessage.message,
        timestamp: incomingMessage.timestamp,
      }
      socket.to(roomId).emit('receiveMessage', outgoingMessage);
    });
  }
}

interface MessagePayload {
  userId: string;
  message: string;
  timestamp: Date;
}
