import * as elasticsearch from 'elasticsearch';
import { Router } from 'express';

function elasticClient(): elasticsearch.Client {
  return new elasticsearch.Client({
    hosts: 'localhost:9200',
    log: 'error'
  });
}

function deleteIndex(): void {
  let client: elasticsearch.Client = elasticClient();
  client.indices.delete({
    index: 'book'
  });
}

function createIndex(): void {
  let client: elasticsearch.Client = elasticClient();
  client.indices.create({
    index: 'book'
  });
}

// Does not allow boolean as return type.
export function checkIfIndexDA(indexName: string): any {
  let client: elasticsearch.Client = elasticClient();
  return client.indices.exists({
    index: indexName
  });
}

export function getContactsConditionalDA(pageSize: number, page: number, queryStr: string) {
  let client: elasticsearch.Client = elasticClient();
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

export function addContactDA(contact: string) {
  console.log(contact);
  let contactObj: Contact = JSON.parse(JSON.stringify(contact));
  let client: elasticsearch.Client = elasticClient();
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

export function updateContactDA(name: string, contact: string) {
  let contactObj: Contact = JSON.parse(JSON.stringify(contact));
  console.log(contactObj.phone);
  let client: elasticsearch.Client = elasticClient();
  return client.updateByQuery({
    index: 'book',
    type: 'doc',
    body: {
      query: { "match": { "name": name } },
      script: "ctx._source.city =  " + "'" + contactObj.city + " ' " + ";"
    }
  });
}

export function getContactDA(name: string) {
  let client: elasticsearch.Client = elasticClient();
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

export function deleteContactDA(name: string) {
  let client: elasticsearch.Client = elasticClient();
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
