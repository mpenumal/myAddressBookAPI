"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactDataAccess_1 = require("./contactDataAccess");
class ContactRoutes {
    // Initialize the ElasticRouter
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    getAll(req, res, next) {
        res.send(contactDataAccess_1.default.getAll());
    }
    addContact(req, res, next) {
        let contact = req.body;
        contactDataAccess_1.default.addContact(contact)
            .then(function (x) {
            res.status = x.status;
        });
    }
    getContact(req, res, next) {
        let name = req.params.name;
        let contact = contactDataAccess_1.default.getContact(name)
            .then(function (x) {
            res.json(x
                .hits
                .hits
                .map(x => { return x._source; }));
        });
    }
    //Take each handler, and attach to one of the Express.Router's endpoints.
    init() {
        this.router.get('/', this.getAll);
        this.router.post('/', this.addContact);
        this.router.get('/:name', this.getContact);
    }
}
exports.ContactRoutes = ContactRoutes;
// Export ElasticRouter
exports.default = new ContactRoutes();
