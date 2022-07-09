import Persistence from './Persistence';
import {Db, MongoClient} from 'mongodb';


export default class Database implements Persistence {
  private static _instance: Database;
  private readonly _protocol: string;
  private _mongoClient: MongoClient;
  private _globalDb: Db;
  private _domainDb: Db;

  constructor() {
    this._protocol = "mongodb://root:123456@localhost:27017/?ssl=false";
  }

  private async initializeMongoClient(): Promise<void> {
    try {
      const db = new MongoClient(
          this._protocol || ''
      );
      this._mongoClient = await db.connect();
    } catch (err) {
      console.log(err);
    }
  }

  private async initializeGlobalDb(): Promise<void> {
    try {
      this._globalDb = this._mongoClient.db('global');
    } catch (err) {
      console.log(err);
    }
  }

  private async initializeDomainDb(domainName: string): Promise<void> {
    try {
      const ret = await this._globalDb
          .collection('domains')
          .findOne({name: domainName});
    if(ret){
        let databaseName = ret.databaseName;
        this._domainDb = this._mongoClient.db(databaseName);
    }
    } catch (err) {
      console.log(err);
    }
  }

  private async closeDb(): Promise<void> {
    try {
      await this._mongoClient.close();
    } catch (err) {
      console.log(err);
    }
  }

  private async initialize(): Promise<void> {
    await this.initializeMongoClient();
    await this.initializeGlobalDb();
  }

  async dataSource(domainName:string): Promise<Db> {
    if (!this._mongoClient) {
      await this.initialize();
    };
    await this.initializeDomainDb(domainName);
    return this._domainDb;
  }

  async globalDataSource() : Promise<Db> {
    if (!this._mongoClient) {
      await this.initialize();
    };
    return this._globalDb;
  }


  static getInstance(): Database {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new Database();
    return this._instance;
  }


  async authenticate(): Promise<void> {
    await this.initialize();
  }

  async sync(force: boolean): Promise<void> {

  }
}