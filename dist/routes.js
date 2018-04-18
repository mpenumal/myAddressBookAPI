"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataAccess_1 = require("./dataAccess");
class ContactRoutes {
    // Initialize the ElasticRouter
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    getAll(req, res, next) {
        let dataAccess = new dataAccess_1.ContactDataAccess();
        res.send(dataAccess.getAll());
    }
    addContact(req, res, next) {
        let contact = req.body;
        let dataAccess = new dataAccess_1.ContactDataAccess();
        dataAccess.addContact(contact)
            .then(function (x) {
            res.status = x.status;
        });
    }
    getContact(req, res, next) {
        let name = req.params.name;
        let dataAccess = new dataAccess_1.ContactDataAccess();
        let contact = dataAccess.getContact(name)
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
