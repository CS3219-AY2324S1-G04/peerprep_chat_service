/**
 * @file Database queries for chat service API.
 */
import { createClient } from 'redis';

export class ChatDatabase {
  private _redisClient;
  public constructor(redisClient: ReturnType<typeof createClient>) {
    this._redisClient = redisClient;
  }

  public async checkValidUser(roomId: string, userId: string) {
    const roomKey = `room:${roomId}`;
    const users = await this._redisClient.sMembers(roomKey);
    return users.includes(userId);
  }

  public async addUsers(roomId: string, userIds: string[]) {
    const roomKey = `room:${roomId}`;
    return await this._redisClient.sAdd(roomKey, userIds);
  }

  public async deleteRoom(roomId: string) {
    const roomKey = `room:${roomId}`;
    return await this._redisClient.del(roomKey);
  }

  public async removeUsers(roomId: string, userIds: string[]) {
    const roomKey = `room:${roomId}`;
    return await this._redisClient.sRem(roomKey, userIds);
  }
}
