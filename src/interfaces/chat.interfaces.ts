/**
 * @file Defines the types within question service API.
 */

export interface ConnectionQuery {
  roomId: string;
  userId: string;
  userName: string;
}

export interface MessagePayload {
  message: string;
  userName: string;
}

export interface RoomEvent {
  readonly eventType: EventType;
  readonly room: Room;
  readonly removedUserId: number; // Only used by remove user event
}

/** Room. */
export interface Room {
  readonly roomId: string;
  readonly userIds: number[];
  readonly questionId: string;
  readonly questionLangSlug: string;
}

/** Event type. */
export enum EventType {
  create = 'create',
  delete = 'delete',
  removeUser = 'remove-user',
}

/** Config for the Room Service MQ consumer. */
export interface RoomServiceMqConsumerConfig {
  readonly password: string;
  readonly user: string;
  readonly host: string;
  readonly port: number;
  readonly vhost: string;
  readonly shouldUseTls: boolean;
  readonly exchangeName: string;
  readonly queueName: string;
}
