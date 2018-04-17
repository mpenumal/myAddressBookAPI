import { Router, Request, Response, NextFunction } from 'express';
import ES from '../elasticsearch/elasticsearch';

export class ElasticRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  public getAll(req: Request, res: Response, next: NextFunction) {
    ES.deleteIndex();
    res.send("HELLO");
  }

  init() {
    this.router.get('/', this.getAll);
  }
}

// Create the HeroRouter, and export its configured Express.Router
const elasticRoutes = new ElasticRouter();
elasticRoutes.init();

export default elasticRoutes.router;