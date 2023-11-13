/**
 * @file Starts the server on defined port.
 * @author Irving de Boer
 */
import server from './app';
import { API_PORT } from './constants/chat.constants';

server.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
