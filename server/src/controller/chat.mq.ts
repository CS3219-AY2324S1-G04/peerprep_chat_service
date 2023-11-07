import RoomServiceMqConsumer from '../message_queue/chat.mq';

export class MessageController {
  private _consumer: any;

  public constructor() {
    this._consumer = new RoomServiceMqConsumer({
        password: 'P@ssword123',
        user: 'user',
        host: 'room_service_mq',
        port: 5672,
        vhost: '', // Vhost is a non-empty string in production
        shouldUseTls: false, // TLS will be used during production
        exchangeName: 'room-events',
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
