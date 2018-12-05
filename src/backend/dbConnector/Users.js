class Users {
  constructor(dbConnector) {
    this.dbConnector = dbConnector;
  }

  connect() {
    return this.dbConnector.connect().then((db) => { return db.collection('users'); })
  }

  addUser(user) {
    return this.connect().then((usersDb) => { return usersDb.insertOne(user) });
  }

  findUser(userId) {
    return this.connect().then((usersDb) => { return usersDb.findOne({userId: userId}); });
  }
}

export default Users;
export {Users};