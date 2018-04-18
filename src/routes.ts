import { Router, Request, Response, NextFunction } from 'express';
import { ContactDataAccess } from './dataAccess';

export class ContactRoutes {
  router: Router

  // Initialize the ElasticRouter
  constructor() {
    this.router = Router();
    this.init();
  }

  public getAll(req: Request, res: Response, next: NextFunction) {
    let dataAccess = new ContactDataAccess();
    res.send(dataAccess.getAll());
  }

  public addContact(req: Request, res: Response, next: NextFunction) {
    let contact = req.body;
    let dataAccess = new ContactDataAccess();
    dataAccess.addContact(contact)
      .then(function (x) {
        res.status = x.status;
      });
  }

  public getContact(req: Request, res: Response, next: NextFunction) {
    let name = req.params.name;
    let dataAccess = new ContactDataAccess();
    let contact = dataAccess.getContact(name)
      .then(function (x) {
        res.json(x
          .hits
          .hits
          .map(x => { return x._source })
        );
      });
  }

  //Take each handler, and attach to one of the Express.Router's endpoints.
  init() {
    this.router.get('/', this.getAll);
    this.router.post('/', this.addContact);
    this.router.get('/:name', this.getContact);
  }
}
