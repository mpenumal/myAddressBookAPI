import * as elasticsearch from 'elasticsearch';
import { Router } from 'express';

export class ContactDataAccess {
  // to hold reference to the elasticsearch client
  public client: elasticsearch.Client;

  constructor() {
    this.elasticClient();
  }

  private elasticClient(): void {
    this.client = new elasticsearch.Client({
      hosts: 'localhost:9200',
      log: 'error'
    });
  }

  public deleteIndex(): void {
    this.client.indices.delete({
      index: 'book'
    });
  }

  public createIndex(): void {
    this.client.indices.create({
      index: 'book'
    });
  }

  // Does not allow boolean as return type.
  public checkIfIndex(indexName: string): any {
    return this.client.indices.exists({
      index: indexName
    });
  }

  public getAll() {
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

  public addContact(contact: string) {
    let contactObj: Contact = JSON.parse(JSON.stringify(contact));
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

  public getContact(name: string) {
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
