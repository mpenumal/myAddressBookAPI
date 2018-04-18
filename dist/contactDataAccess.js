"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch = require("elasticsearch");
class ContactDataAccess {
    constructor() {
        this.elasticClient();
    }
    elasticClient() {
        this.client = new elasticsearch.Client({
            hosts: 'localhost:9200',
            log: 'error'
        });
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
exports.default = new ContactDataAccess();
