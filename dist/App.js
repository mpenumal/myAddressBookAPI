"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const ElasticRouter_1 = require("./routes/ElasticRouter");
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
        // welcome page
        let router = express.Router();
        router.get('/', (req, res, next) => {
            res.send("Welcome!");
        });
        this.express.use('/', router);
        this.express.use('/elastic/', ElasticRouter_1.default.router);
    }
}
exports.default = new App().express;
