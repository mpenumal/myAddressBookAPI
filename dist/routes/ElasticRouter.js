"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const elasticsearch_1 = require("../elasticsearch/elasticsearch");
class ElasticRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    getAll(req, res, next) {
        elasticsearch_1.default.deleteIndex();
        res.send("HELLO");
    }
    init() {
        this.router.get('/', this.getAll);
    }
}
exports.ElasticRouter = ElasticRouter;
// Create the HeroRouter, and export its configured Express.Router
const elasticRoutes = new ElasticRouter();
elasticRoutes.init();
exports.default = elasticRoutes.router;
