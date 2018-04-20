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
function elasticClient() {
    return new elasticsearch.Client({
        hosts: default_1.config.hosts,
        log: 'error'
    });
}
function deleteIndex() {
    const client = elasticClient();
    return client.indices.delete({
        index: default_1.config.index
    });
}
function createIndex(timeout = '5') {
    const client = elasticClient();
    return client.indices.create({
        index: default_1.config.index,
        timeout
    });
}
// Does not allow boolean as return type.
function checkIfIndexDA(index) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield elasticClient().indices.exists({ index });
        }
        catch (_a) {
            yield createIndex();
            return true;
        }
    });
}
exports.checkIfIndexDA = checkIfIndexDA;
function getContactsConditionalDA(pageSize, page, queryStr) {
    const client = elasticClient();
    return client.search({
        index: default_1.config.index,
        type: default_1.config.type,
        body: {
            query: {
                query_string: {
                    fields: ['name', 'phone', 'city'],
                    query: `'${queryStr}'`
                },
                from: page,
                size: pageSize
            }
        }
    })
        .then(results => results.hits.hits.map(x => x._source))
        .catch(x => {
        throw new Error(`Cannot get the requested contacts. ${x}`);
    });
}
exports.getContactsConditionalDA = getContactsConditionalDA;
function getContactDA(name) {
    const client = elasticClient();
    return client.search({
        index: default_1.config.index,
        type: default_1.config.type,
        body: {
            query: {
                match: {
                    name
                }
            }
        }
    })
        .then(results => results.hits.hits.map(x => x._source))
        .catch(x => {
        throw new Error(`Cannot get the requested contacts. ${x}`);
    });
}
exports.getContactDA = getContactDA;
function addContactDA(contact) {
    const client = elasticClient();
    return client.index({
        index: default_1.config.index,
        type: default_1.config.type,
        body: contact
    })
        .then(x => 'Add Contact - Success.')
        .catch(x => `Cannot add contact. ${x}`);
}
exports.addContactDA = addContactDA;
function updateContactDA(name, contact) {
    const client = elasticClient();
    return client.updateByQuery({
        index: default_1.config.index,
        type: default_1.config.type,
        body: {
            query: { match: { name } },
            script: `ctx._source.name = '${contact.name}';
      ctx._source.phone = '${contact.phone}';
      ctx._source.city = '${contact.city}';`
        }
    })
        .then(x => `Update Contact - Success.`)
        .catch(x => `Cannot update contact. ${x}`);
}
exports.updateContactDA = updateContactDA;
function deleteContactDA(name) {
    const client = elasticClient();
    return client.deleteByQuery({
        index: default_1.config.index,
        type: default_1.config.type,
        body: {
            query: {
                match: {
                    name
                }
            }
        }
    })
        .then(x => `Delete Contact - Success.`)
        .catch(x => `Cannot delete contact. ${x}`);
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
