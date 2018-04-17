import * as elasticsearch from 'elasticsearch';

class ElasticSearchDB {

  // to hold reference to the elasticsearch client
  public client: elasticsearch.Client;

  // Configuration of elasticsearch client
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

  public addContact(contact: string): void {
    // contact is obtained as JSON, expecting string.
    console.log(contact);
    let contactObj: Contact = JSON.parse(JSON.stringify(contact));
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

  public getContact(name: string): string {
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

export default new ElasticSearchDB();
