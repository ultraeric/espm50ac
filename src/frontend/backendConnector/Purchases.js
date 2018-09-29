import {Guac} from 'guac-hoc/lib/Guac';

class Purchases {
  constructor(socket) {
    this.socket = socket;
    this.bindAllMethods();
  }

  makePurchase(purchase, creds) {
    let data = {creds: creds, payload: purchase};
    this.socket.emit('/request/purchases/new', data);
  }

  confirmPurchase(purchase, creds) {
    let data = {creds: creds, payload: purchase};
    this.socket.emit('/request/purchases/confirm', data);
  }
}

Purchases = Guac(Purchases);

export default Purchases;
export {Purchases};