import * as elasticsearch from 'elasticsearch';
import { Router } from 'express';
import { config } from './config/default';

class ElasticClient {
  static client: elasticsearch.Client = ElasticClient.elasticClient();
  static elasticClient() {
    return new elasticsearch.Client({
      hosts: 'localhost:9200',
      log: 'error'
    });
  }
}

export async function deleteIndex(index: string) {
  try {
    await ElasticClient.client.indices.delete({ index });
  } catch (e) {
    return e;
  }
}

async function createIndex(index: string) {
  try {
    await ElasticClient.client.indices.create({ index });
  } catch (e) {
    return e;
  }
}

// Does not allow boolean as return type.
export async function checkIfIndexDA(index: string) {
  try {
    await ElasticClient.client.indices.exists({ index });
  } catch {
    try {
      await createIndex(index);
    } catch (e) {
      return e;
    }
  }
}

export async function getContactsConditionalDA(size: number, from: number, query: string) {
  try {
    const results = await ElasticClient.client.msearch({
      body: [
        { ...config },
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
      ? results.responses.map((responses) => responses.hits.hits.map((x) => x._source as Contact))
      : [];
  } catch (e) {
    throw new Error(`Cannot get the requested contacts. ${e}`);
  }
}

export async function getContactDA(name: string) {
  try {
    const result = await ElasticClient.client.search({
      ...config,
      body: {
        query: {
          match: {
            name
          }
        }
      }
    });
    return result.hits.hits[0]._source as Contact;
  } catch (e) {
    throw new Error(`Cannot get the requested contact. ${e}`);
  }
}

export async function addContactDA(contact: Contact) {
  try {
    const result = await ElasticClient.client.index({
      ...config,
      body: contact
    });
    return `Add Contact - Success.`;
  } catch (e) {
    throw new Error(`Cannot add contact. ${e}`);
  }
}

export async function updateContactDA(name: string, contact: Contact) {
  try {
    const result = await ElasticClient.client.updateByQuery({
      ...config,
      body: {
        query: { match: { name } },
        script: `ctx._source.name = '${contact.name}';
        ctx._source.phone = '${contact.phone}';
        ctx._source.city = '${contact.city}';`
      }
    });
    return `Update Contact - Success.`;
  } catch (e) {
    throw new Error(`Cannot update contact. ${e}`);
  }
}

export async function deleteContactDA(name: string) {
  try {
    const result = await ElasticClient.client.deleteByQuery({
      ...config,
      body: {
        query: { match: { name } }
      }
    });
    return `Delete Contact - Success.`;
  } catch (e) {
    throw new Error(`Cannot delete contact. ${e}`);
  }
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