/**
 * @file Defines the constants within chat service API.
 */

export const REDIS_USERNAME = process.env.REDIS_USERNAME!;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD!;
export const REDIS_HOST = process.env.REDIS_HOST!;
export const REDIS_PORT = process.env.REDIS_PORT!;
export const REDIS_SHOULD_USE_TLS = process.env.REDIS_SHOULD_USE_TLS === 'true';

export const ROOM_SERVICE_MQ_USER = process.env.ROOM_SERVICE_MQ_USER!;
export const ROOM_SERVICE_MQ_PASSWORD = process.env.ROOM_SERVICE_MQ_PASSWORD!;
export const ROOM_SERVICE_MQ_HOST = process.env.ROOM_SERVICE_MQ_HOST!;
export const ROOM_SERVICE_MQ_PORT = process.env.ROOM_SERVICE_MQ_PORT!;
export const ROOM_SERVICE_MQ_VHOST = process.env.ROOM_SERVICE_MQ_VHOST!;
export const ROOM_SERVICE_MQ_SHOULD_USE_TLS =
  process.env.ROOM_SERVICE_MQ_SHOULD_USE_TLS == 'true';
export const ROOM_SERVICE_MQ_EXCHANGE_NAME =
  process.env.ROOM_SERVICE_MQ_EXCHANGE_NAME!;
export const ROOM_SERVICE_MQ_QUEUE_NAME =
  process.env.ROOM_SERVICE_MQ_QUEUE_NAME!;

export const API_PORT = process.env.API_PORT!;
export const IS_PROD = process.env.NODE_ENV === 'production';
