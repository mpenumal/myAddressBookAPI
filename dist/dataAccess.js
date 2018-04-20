"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch = require("elasticsearch");
const default_1 = require("./config/default");
class ElasticClient {
    static elasticClient() {
        return new elasticsearch.Client({
            hosts: 'localhost:9200',
            log: 'error'
        });
    }
}
ElasticClient.client = ElasticClient.elasticClient();
function deleteIndex(index) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield ElasticClient.client.indices.delete({ index });
        }
        catch (e) {
            return e;
        }
    });
}
exports.deleteIndex = deleteIndex;
function createIndex(index) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield ElasticClient.client.indices.create({ index });
        }
        catch (e) {
            return e;
        }
    });
}
// Does not allow boolean as return type.
function checkIfIndexDA(index) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield ElasticClient.client.indices.exists({ index });
        }
        catch (_a) {
            try {
                yield createIndex(index);
            }
            catch (e) {
                return e;
            }
        }
    });
}
exports.checkIfIndexDA = checkIfIndexDA;
function getContactsConditionalDA(size, from, query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const results = yield ElasticClient.client.msearch({
                body: [
                    Object.assign({}, default_1.config),
                    {
                        query: {
                            query_string: { query }
                        },
                        from,
                        size
                    }
                ]
            });
            return results.responses !== undefined
                ? results.responses.map((responses) => responses.hits.hits.map((x) => x._source))
                : [];
        }
        catch (e) {
            throw new Error(`Cannot get the requested contacts. ${e}`);
        }
    });
}
exports.getContactsConditionalDA = getContactsConditionalDA;
function getContactDA(name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield ElasticClient.client.search(Object.assign({}, default_1.config, { body: {
                    query: {
                        match: {
                            name
                        }
                    }
                } }));
            return result.hits.hits[0]._source;
        }
        catch (e) {
            throw new Error(`Cannot get the requested contact. ${e}`);
        }
    });
}
exports.getContactDA = getContactDA;
function addContactDA(contact) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield ElasticClient.client.index(Object.assign({}, default_1.config, { body: contact }));
            return `Add Contact - Success.`;
        }
        catch (e) {
            throw new Error(`Cannot add contact. ${e}`);
        }
    });
}
exports.addContactDA = addContactDA;
function updateContactDA(name, contact) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield ElasticClient.client.updateByQuery(Object.assign({}, default_1.config, { body: {
                    query: { match: { name } },
                    script: `ctx._source.name = '${contact.name}';
        ctx._source.phone = '${contact.phone}';
        ctx._source.city = '${contact.city}';`
                } }));
            return `Update Contact - Success.`;
        }
        catch (e) {
            throw new Error(`Cannot update contact. ${e}`);
        }
    });
}
exports.updateContactDA = updateContactDA;
function deleteContactDA(name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield ElasticClient.client.deleteByQuery(Object.assign({}, default_1.config, { body: {
                    query: { match: { name } }
                } }));
            return `Delete Contact - Success.`;
        }
        catch (e) {
            throw new Error(`Cannot delete contact. ${e}`);
        }
    });
}
exports.deleteContactDA = deleteContactDA;
/*
const getArray = (inp: string | Array<any>) => Array.isArray(inp) ? inp : inp.split(',');
function concat(a: string | Array<any>, b: string | Array<any>) {
  return [...getArray(a), ...getArray(b)];
}

concat('5', '5');

function addSpecialName<T extends { name: string, specialName?: string }>(o: T) {
  o.specialName = o.name.toUpperCase();
  return o;
}

addSpecialName({ name: 'bob', age: 20 });

const map: { [key: string]: any } = {
  name: 'green'
}
*/ 
