class Flights {
  constructor(dbConnector) {
    this.dbConnector = dbConnector;
  }

  connect() {
    return this.dbConnector.connect().then((db) => { return db.collection('flights'); })
  }

  addFlight(flight) {
    return this.connect().then((flightsDb) => { return flightsDb.insertOne(flight) });
  }
}

export default Flights;
export {Flights};