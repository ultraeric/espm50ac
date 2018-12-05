import io from 'socket.io-client';
import User from './User';
import Tracking from './Tracking';
import {Guac} from 'guac-hoc/lib/Guac';

class Backend {
  constructor(ioUrl = 'http://localhost:8081/') {
    this.bindAllMethods();
    this.socket = io(ioUrl);
    this.user = new User(this.socket);
    this.tracking = new Tracking(this.socket);
  }

  on(eventName, callback) {
    this.socket.on(eventName, callback);
  }
  removeListener(eventName, callback) {
    this.socket.removeListener(eventName, callback);
  }
}
``
Backend = Guac(Backend);
const backend = new Backend();

export default Backend;
export {Backend, backend};
