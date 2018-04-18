import { Router, Request, Response, NextFunction } from 'express';
import {
  getContactDA, addContactDA,
  updateContactDA, deleteContactDA,
  getContactsConditionalDA, checkIfIndexDA
} from './dataAccess';

export const router: Router = Router();
this.router.get('/pageSize={:pageSize}&page={:page}&query={:queryStr}', getContactsConditional);
this.router.post('/', addContact);
this.router.get('/:name', getContact);
this.router.put('/:name', updateContact);
this.router.delete('/:name', deleteContact);

function getContactsConditional(req: Request, res: Response, next: NextFunction) {
  let pageSize: number = req.params.pageSize;
  let page: number = req.params.page;
  let queryStr: string = req.params.queryStr;
  getContactsConditionalDA(pageSize, page, queryStr)
    .then(function (x) {
      res.json(x.responses);
    });
}

function addContact(req: Request, res: Response, next: NextFunction) {
  let contact: string = req.body;
  addContactDA(contact)
    .then(function (x) {
      res.status = x.status;
    });
}

function updateContact(req: Request, res: Response, next: NextFunction) {
  let contact: string = req.body;
  let name: string = req.params.name;
  updateContactDA(name, contact)
    .then(function (x) {
      res.send(x.updated);
    });
}

function getContact(req: Request, res: Response, next: NextFunction) {
  let name: string = req.params.name;
  console.log(name);
  getContactDA(name)
    .then(function (x) {
      res.json(x
        .hits
        .hits
        .map(x => { return x._source })
      );
    });
}

function deleteContact(req: Request, res: Response, next: NextFunction) {
  deleteContactDA(name)
    .then(function (x) {
      res.send(x.deleted);
    });
}
