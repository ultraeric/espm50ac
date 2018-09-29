import {Guac} from 'guac-hoc/lib/Guac';

class Claims {
  constructor(socket) {
    this.socket = socket;
    this.bindAllMethods();
  }

  makeClaim(claim, creds) {
    let data = {creds: creds, payload: claim};
    this.socket.emit('/request/claims/create', data);
  }

  getClaims(creds) {
    let data = {creds: creds};
    this.socket.emit('/request/claims/getAll', data);
  }
}
Claims = Guac(Claims);

export default Claims;
export {Claims};