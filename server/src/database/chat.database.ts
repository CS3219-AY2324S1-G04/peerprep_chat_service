import { MessagePayload } from '../controller/chat.room';

export class RedisDatabase {
  private _client: any;

  public constructor(client: any) {
    this._client = client;
  }

  public async createRoom(roomId: string): Promise<void> {
    await this._client.rPush(`messageHistory:${roomId}`, []);
  }

  public async deleteRoom(roomId: string): Promise<void> {
    await this._client.del(`messageHistory:${roomId}`);
  }

  public async getRoom(roomId: string): Promise<string[]> {
    return await this._client.lRange(`messageHistory:${roomId}`, 0, -1);
  }

  public async addMessage(roomId: string | string[], messagePayload: MessagePayload): Promise<void> {
    // TODO: Handle string[] case
    await this._client.rPush(`messageHistory:${roomId}`, messagePayload);
  }
}
