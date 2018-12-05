class Resources {
  constructor(dbConnector) {
    this.dbConnector = dbConnector;
  }

  connect() {
    return this.dbConnector.connect().then((db) => { return db.collection('resources'); })
  }

  addResource(resource) {
    return this.connect().then((resourcesDb) => { return resourcesDb.insertOne(resource) });
  }

  findResource(resource) {
    return this.connect().then((resourcesDb) => { return resourcesDb.findOne(resource); });
  }

  getResources(userId) {
    return this.connect().then((resourcesDb) => { return resourcesDb.find({userId: userId}).toArray(); });
  }
}

export default Resources;
export {Resources};