"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const contactRoutes_1 = require("./contactRoutes");
/*
// Creates and configures an ExpressJS web server.
class App {
  // Hold a reference to our instance of Express
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure any middleware that we want to use.
  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  // Attach any routers/route handlers that we create.
  private routes(): void {
    // welcome page
    let router = express.Router();
    router.get('/', (req, res, next) => {
      res.send("Welcome!");
    });

    this.express.use('/', router);
    this.express.use('/elastic/', elasticRouter.router);
  }
}
*/
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
let router = express.Router();
router.get('/', (req, res, next) => {
    res.send("Welcome!");
});
app.use('/', router);
app.use('/contacts/', contactRoutes_1.default.router);
exports.default = app;
