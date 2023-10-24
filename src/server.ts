/**
 * @file Starts the server on defined port.
 * @author Irving de Boer
 */
import app from './app';
import { PORT } from './constants/chat.constants';

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
