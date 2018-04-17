import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import elasticRouter from './routes/elasticRouter';

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
    this.express.use('/', elasticRouter);
  }
}

export default new App().express;