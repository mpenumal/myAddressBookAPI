"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const debug = require("debug");
const express = require("express");
const bodyParser = require("body-parser");
const routes_1 = require("./routes");
debug('ts-express:server');
exports.app = express();
exports.app.use(bodyParser.json());
exports.app.use(bodyParser.urlencoded({ extended: false }));
exports.app.use('/', express.Router().get('/', (req, res, next) => {
    res.send('Welcome to AddressBook!');
}));
exports.app.use('/contact', routes_1.router);
// Get a port value from the environment, or set a default port number of 3000
const port = normalizePort(process.env.PORT || 3000);
exports.app.set('port', port);
// Create the HTTP server, and pass App to it (this will be our Express app)
const server = http.createServer(exports.app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
function normalizePort(val) {
    const tempPort = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(tempPort)) {
        return val;
    }
    else if (tempPort >= 0) {
        return tempPort;
    }
    else {
        return false;
    }
}
// Set up some basic error handling and a terminal log to show us when the app is ready and listening
function onError(error) {
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
function onListening() {
    const addr = server.address();
    const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
}
