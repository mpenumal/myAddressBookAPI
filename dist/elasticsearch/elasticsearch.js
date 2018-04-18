"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch = require("elasticsearch");
const express_1 = require("express");
class ElasticSearchDB {
    // Configuration of elasticsearch client
    constructor() {
        this.router = express_1.Router();
        this.elasticClient();
        this.init();
    }
    elasticClient() {
        this.client = new elasticsearch.Client({
            hosts: 'localhost:9200',
            log: 'error'
        });
    }
    init() {
        this.router.get('/', this.getAll);
        this.router.post('/', this.addContact);
        // this.router.get('/:name', this.getContact);
    }
    deleteIndex() {
        this.client.indices.delete({
            index: 'book'
        });
    }
    createIndex() {
        this.client.indices.create({
            index: 'book'
        });
    }
    // Does not allow boolean as return type.
    checkIfIndex(indexName) {
        return this.client.indices.exists({
            index: indexName
        });
    }
    getAll() {
        return this.client.msearch({
            index: 'book',
            type: 'doc',
            body: {
                query: {
                    match_all: {}
                }
            }
        });
    }
    addContact(contact) {
        // contact is obtained as JSON, expecting string.
        let contactObj = JSON.parse(JSON.stringify(contact));
        return this.client.index({
            index: 'book',
            type: 'doc',
            body: {
                "name": contactObj.name,
                "phone": contactObj.phone,
                "city": contactObj.city
            }
        });
    }
    getContact(name) {
        return this.client.search({
            index: 'book',
            type: 'doc',
            body: {
                query: {
                    match: {
                        "name": name
                    }
                }
            }
        });
    }
}
exports.default = new ElasticSearchDB();
