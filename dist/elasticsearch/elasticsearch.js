"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch = require("elasticsearch");
class ElasticSearchDB {
    // Configuration of elasticsearch client
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
    addContact(contact) {
        // contact is obtained as JSON, expecting string.
        console.log(contact);
        console.log(contact[0]);
        let contactObj = JSON.parse((contact));
        this.client.index({
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
        }).toString();
    }
}
exports.default = new ElasticSearchDB();
