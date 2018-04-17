"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const elasticsearch_1 = require("../elasticsearch/elasticsearch");
class ElasticRouter {
    // Initialize the HeroRouter
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    getAll(req, res, next) {
        res.send("Hello");
    }
    addContact(req, res, next) {
        let contact = req.body;
        res.send(elasticsearch_1.default.addContact(contact));
    }
    getContact(req, res, next) {
        let name = req.params[0];
        res.send(elasticsearch_1.default.getContact(name));
    }
    //Take each handler, and attach to one of the Express.Router's endpoints.
    init() {
        this.router.get('/', this.getAll);
        this.router.post('/', this.addContact);
        this.router.get('/:name', this.getContact);
    }
}
exports.ElasticRouter = ElasticRouter;
// Create the HeroRouter, and export its configured Express.Router
const elasticRoutes = new ElasticRouter();
elasticRoutes.init();
exports.default = elasticRoutes;
