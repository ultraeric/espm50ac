const MongoClient = require('mongodb').MongoClient;
const defaultUrl = 'mongodb://actest:actest0@ds263759.mlab.com:63759/espm';
import {Guac} from 'guac-hoc/lib/Guac';
import {Resources} from './Resources';
import {Users} from './Users';

class DatabaseConnector {
  constructor(url = defaultUrl) {
    this.bindAllMethods();
    this.url = url;
    this.connect().then(
      (db) => {
        db.collection('resources');
      }
    );
    this.resources = new Resources(this);
    this.users = new Users(this);
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