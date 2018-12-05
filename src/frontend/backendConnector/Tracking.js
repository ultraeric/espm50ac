import {Guac} from 'guac-hoc/lib/Guac';

class Tracking {
  constructor(socket) {
    this.socket = socket;
    this.bindAllMethods();
  }

  registerItem(auth, purchasedItem) {
    this.socket.emit('/request/tracking/new', {auth: auth, item: purchasedItem});
  }

  edit(auth, purchasedItem, message) {
    this.socket.emit('/request/tracking/update', {auth: auth, item: purchasedItem, message: message})
  }

  commit(auth, purchasedItem) {
    this.socket.emit('/request/tracking/commit', {auth: auth, item: purchasedItem});
  }

  getAll(auth) {
    this.socket.emit('/request/tracking/getAll', {auth: auth});
  }
}

Tracking = Guac(Tracking);

export default Tracking;
export { Tracking };