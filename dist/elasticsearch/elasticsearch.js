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
    checkIfIndex(indexName) {
        return this.client.indices.exists({
            index: indexName
        });
    }
    initMapping() {
        return this.client.indices.putMapping({
            index: 'book',
            type: 'doc',
            body: {
                properties: {
                    title: { type: "string" },
                    content: { type: "string" }
                }
            }
        });
    }
    addDocument(document) {
        this.client.index({
            index: 'book',
            type: 'doc',
            body: {
                title: document.title,
                content: document.textContent
            }
        });
    }
}
exports.default = new ElasticSearchDB();
