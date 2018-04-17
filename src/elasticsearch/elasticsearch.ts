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

  public checkIfIndex(indexName: string): any {
    return this.client.indices.exists({
      index: indexName
    });
  }

  public initMapping(): any {
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

  public addDocument(document: Document): void {
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

export default new ElasticSearchDB();
