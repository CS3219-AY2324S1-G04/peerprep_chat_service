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
