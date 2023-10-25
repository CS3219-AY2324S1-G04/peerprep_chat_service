/**
 * @file Starts the server on defined port.
 * @author Irving de Boer
 */
import server from './app';
import { PORT } from './constants/chat.constants';

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
