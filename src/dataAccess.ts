import * as elasticsearch from 'elasticsearch';
import { Router } from 'express';
import { config } from './config/default';

function elasticClient() {
  return new elasticsearch.Client({
    hosts: config.hosts,
    log: 'error'
  });
}

function deleteIndex() {
  const client = elasticClient();
  return client.indices.delete({
    index: config.index
  });
}

function createIndex(timeout = '5') {
  const client = elasticClient();
  return client.indices.create({
    index: config.index,
    timeout
  });
}

// Does not allow boolean as return type.
export async function checkIfIndexDA(index: string) {
  try {
    await elasticClient().indices.exists({ index });
  } catch {
    await createIndex();
    return true;
  }
}

export function getContactsConditionalDA(pageSize: number, page: number, queryStr: string) {
  const client = elasticClient();
  return client.search({
    index: config.index,
    type: config.type,
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
    .then(results => results.hits.hits.map(x => x._source as Contact))
    .catch(x => {
      throw new Error(`Cannot get the requested contacts. ${x}`);
    });
}

export function getContactDA(name: string) {
  const client = elasticClient();
  return client.search({
    index: config.index,
    type: config.type,
    body: {
      query: {
        match: {
          name
        }
      }
    }
  })
    .then(results => results.hits.hits.map(x => x._source as Contact))
    .catch(x => {
      throw new Error(`Cannot get the requested contacts. ${x}`);
    });
}

export function addContactDA(contact: Contact) {
  const client = elasticClient();
  return client.index({
    index: config.index,
    type: config.type,
    body: contact
  })
    .then(x => 'Add Contact - Success.')
    .catch(x => `Cannot add contact. ${x}`);
}

export function updateContactDA(name: string, contact: Contact) {
  const client = elasticClient();
  return client.updateByQuery({
    index: config.index,
    type: config.type,
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

export function deleteContactDA(name: string) {
  const client = elasticClient();
  return client.deleteByQuery({
    index: config.index,
    type: config.type,
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