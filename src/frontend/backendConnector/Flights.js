import {Guac} from 'guac-hoc/lib/Guac';

class Flights {
  constructor(socket) {
    this.socket = socket;
    this.bindAllMethods();
  }
}

Flights = Guac(Flights);

export default Flights;
export {Flights};