class Claims {
  constructor(dbConnector) {
    this.dbConnector = dbConnector;
  }

  connect() {
    return this.dbConnector.connect().then((db) => { return db.collection('claims'); })
  }

  addClaim(claim) {
    return this.connect().then((claimsDb) => { return claimsDb.insertOne(claim) });
  }

  findClaim(claim) {
    return this.connect().then((claimsDb) => { return claimsDb.findOne(claim); });
  }

  getClaims(flyerNumber) {
    return this.connect().then((claimsDb) => { return claimsDb.find({flyerNumber: flyerNumber}).toArray(); });
  }
}

export default Claims;
export {Claims};