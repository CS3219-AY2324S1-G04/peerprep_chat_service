import RoomServiceMqConsumer from '../message_queue/chat.mq';
import * as dotenv from 'dotenv';

dotenv.config();

export class MessageController {
  private _consumer: any;

  public constructor() {
    this._consumer = new RoomServiceMqConsumer({
        password: process.env.MQ_PASSWORD!,
        user: process.env.MQ_USER!,
        host: 'room_service_mq',
        port: 5672,
        vhost: '', // Vhost is a non-empty string in production
        shouldUseTls: false, // TLS will be used during production
        exchangeName: process.env.MQ_EXCHANGE_NAME!,
        queueName: 'chat-service-room-event-queue',
      }
    );

    this._setUpConsumer();
    this._getMessages();
  }

  private async _setUpConsumer() {
    await this._consumer.initialise();
  }

  private async _getMessages() {
    await this._consumer.consume( async (data: any) => {
      console.log(`Received: ${JSON.stringify(data)}`);
    });
  }
}
