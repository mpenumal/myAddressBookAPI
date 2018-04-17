import * as http from 'http';
import * as debug from 'debug';

import App from './App';

// Use debug to set up some terminal logging for the app
debug('ts-express:server');

// Get a port value from the environment, or set a default port number of 3000
const port = normalizePort(process.env.PORT || 3000);
App.set('port', port);

function normalizePort(val: number | string): number | string | boolean {
  let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
  if (isNaN(port)) return val;
  else if (port >= 0) return port;
  else return false;
}

// Create the HTTP server, and pass App to it (this will be our Express app)
const server = http.createServer(App);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Set up some basic error handling and a terminal log to show us when the app is ready and listening
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') throw error;
  let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
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
  let addr = server.address();
  let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}