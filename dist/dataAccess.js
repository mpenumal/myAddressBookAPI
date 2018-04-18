"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch = require("elasticsearch");
function elasticClient() {
    return new elasticsearch.Client({
        hosts: 'localhost:9200',
        log: 'error'
    });
}
function deleteIndex() {
    let client = elasticClient();
    client.indices.delete({
        index: 'book'
    });
}
function createIndex() {
    let client = elasticClient();
    client.indices.create({
        index: 'book'
    });
}
// Does not allow boolean as return type.
function checkIfIndexDA(indexName) {
    let client = elasticClient();
    return client.indices.exists({
        index: indexName
    });
}
exports.checkIfIndexDA = checkIfIndexDA;
function getContactsConditionalDA(pageSize, page, queryStr) {
    let client = elasticClient();
    return client.msearch({
        body: [
            {
                index: 'book',
                type: 'doc'
            },
            {
                query: {
                    query_string: {
                        query: queryStr
                    }
                },
                from: page,
                size: pageSize
            },
        ]
    });
}
exports.getContactsConditionalDA = getContactsConditionalDA;
function addContactDA(contact) {
    let contactObj = JSON.parse(JSON.stringify(contact));
    let client = elasticClient();
    return client.index({
        index: 'book',
        type: 'doc',
        body: {
            "name": contactObj.name,
            "phone": contactObj.phone,
            "city": contactObj.city
        }
    });
}
exports.addContactDA = addContactDA;
function updateContactDA(name, contact) {
    let contactObj = JSON.parse(JSON.stringify(contact));
    let client = elasticClient();
    return client.updateByQuery({
        index: 'book',
        type: 'doc',
        body: {
            query: {
                term: {
                    "name": name
                }
            },
            "name": contactObj.name,
            "phone": contactObj.phone,
            "city": contactObj.city
        }
    });
}
exports.updateContactDA = updateContactDA;
function getContactDA(name) {
    let client = elasticClient();
    return client.search({
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
exports.getContactDA = getContactDA;
function deleteContactDA(name) {
    let client = elasticClient();
    return client.deleteByQuery({
        index: 'book',
        type: 'doc',
        body: {
            query: {
                term: {
                    "name": name
                }
            }
        }
    });
}
exports.deleteContactDA = deleteContactDA;
