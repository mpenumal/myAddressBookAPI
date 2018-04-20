import * as http from 'http';
import * as debug from 'debug';
import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { router } from './routes';

debug('ts-express:server');

export const app: express.Application = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', express.Router().get('/', (req, res, next) => {
  res.send('Welcome to AddressBook!');
}));
app.use('/contact', router);

// Get a port value from the environment, or set a default port number of 3000
const port = normalizePort(process.env.PORT || 3000);
app.set('port', port);

// Create the HTTP server, and pass App to it (this will be our Express app)
const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val: number | string): number | string | boolean {
  const tempPort: number = (typeof val === 'string') ? parseInt(val, 10) : val;
  if (isNaN(tempPort)) {
    return val;
  } else if (tempPort >= 0) {
    return tempPort;
  } else {
    return false;
  }
}

// Set up some basic error handling and a terminal log to show us when the app is ready and listening
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = (typeof port === 'string') ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  const addr = server.address();
  const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}
