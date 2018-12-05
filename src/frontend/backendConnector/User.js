import {Guac} from 'guac-hoc/lib/Guac';

class User {
  constructor(socket) {
    this.socket = socket;
    this.bindAllMethods();
  }

  login(userId, password) {
    this.socket.emit('/request/login', {auth: {userId: userId, password: password}});
  }
}
User = Guac(User);

export default User;
export { User };