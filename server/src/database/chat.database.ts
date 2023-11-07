export class RedisDatabase {
  private _client: any;

  public constructor(client: any) {
    this._client = client;
  }
}
