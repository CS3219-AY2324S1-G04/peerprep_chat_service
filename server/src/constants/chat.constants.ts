import * as dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.EXPRESS_DOCKER_PORT!;
