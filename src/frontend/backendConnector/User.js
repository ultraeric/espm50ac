import {Guac} from 'guac-hoc/lib/Guac';

class User {
  constructor(socket) {
    this.socket = socket;
    this.bindAllMethods();
  }

  login(flyerNumber, password) {
    this.socket.emit('/request/login', {flyerNumber: flyerNumber, password: password});
  }
}
User = Guac(User);

export default User;
export { User };