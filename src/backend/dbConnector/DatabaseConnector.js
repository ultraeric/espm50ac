const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const defaultUrl = 'INSERT MONGO CLIENT';
import {Guac} from 'guac-hoc/lib/Guac';
import {Claims} from './Claims';

class DatabaseConnector {
  constructor(url = defaultUrl) {
    this.bindAllMethods();
    this.url = url;
    this.connect().then(
      (db) => {
        db.collection('claims');
        db.collection('flights');
      }
    );
    this.claims = new Claims(this);
  }

  /** Returns a Promise **/
  connect() {
    console.log('Connection initiated');
    return MongoClient.connect(this.url, {useNewUrlParser: true})
      .then((db) => {
        console.log('Connected to database successfully.');
        return db.db();
      }).catch((err) => {
        console.log('Could not connect to database. See error log for details.');
        throw(err);
      });
  }
}

DatabaseConnector = Guac(DatabaseConnector);

export default DatabaseConnector;
export {DatabaseConnector};