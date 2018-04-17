"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const elasticRouter_1 = require("./routes/elasticRouter");
// Creates and configures an ExpressJS web server.
class App {
    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }
    // Configure any middleware that we want to use.
    middleware() {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }
    // Attach any routers/route handlers that we create.
    routes() {
        this.express.use('/', elasticRouter_1.default);
    }
}
exports.default = new App().express;
