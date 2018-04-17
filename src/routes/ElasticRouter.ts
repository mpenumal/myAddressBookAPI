import { Router, Request, Response, NextFunction } from 'express';
import ES from '../elasticsearch/elasticsearch';

export class ElasticRouter {
  router: Router

  // Initialize the HeroRouter
  constructor() {
    this.router = Router();
    this.init();
  }

  public getAll(req: Request, res: Response, next: NextFunction) {
    res.send("Hello");
  }

  public addContact(req: Request, res: Response, next: NextFunction) {
    let contact = req.body;
    res.send(ES.addContact(contact));
  }

  public getContact(req: Request, res: Response, next: NextFunction) {
    let name = req.params[0];
    res.send(ES.getContact(name));
  }

  //Take each handler, and attach to one of the Express.Router's endpoints.
  init() {
    this.router.get('/', this.getAll);
    this.router.post('/', this.addContact);
    this.router.get('/:name', this.getContact);
  }

}

// Create the HeroRouter, and export its configured Express.Router
const elasticRoutes = new ElasticRouter();
elasticRoutes.init();

export default elasticRoutes;