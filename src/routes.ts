import { Router, Request, Response, NextFunction } from 'express';
import {
  getContactDA, addContactDA,
  updateContactDA, deleteContactDA,
  getContactsConditionalDA, checkIfIndexDA
} from './dataAccess';

function RunOperation(target: Routes, property: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (req: Request, res: Response) {
    return originalMethod(req, res)
      .then((x: Response) => { res.json(x) })
      .catch((x: Response) => { res.send(x) });
  }
}

class Routes {
  @RunOperation
  static async getContactsConditional(req: Request, res: Response) {
    const contacts = await getContactsConditionalDA(req.query.pageSize, req.query.page, req.query.query);
    return contacts;
  }

  @RunOperation
  static async getContact(req: Request, res: Response) {
    const contact = await getContactDA(req.params.name);
    return contact;
  }

  @RunOperation
  static async addContact(req: Request, res: Response) {
    const result = await addContactDA(req.body);
    return result;
  }

  @RunOperation
  static async updateContact(req: Request, res: Response) {
    const result = await updateContactDA(req.params.name, req.body);
    return result;
  }

  @RunOperation
  static async deleteContact(req: Request, res: Response) {
    const result = await deleteContactDA(req.params.name);
    return result;
  }
}

export const router: Router = Router();
router.get('/', Routes.getContactsConditional);
router.get('/:name', Routes.getContact);
router.post('/', Routes.addContact);
router.put('/:name', Routes.updateContact);
router.delete('/:name', Routes.deleteContact);
