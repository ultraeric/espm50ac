import {connectUser} from 'backend/ioConnector/user';
import {connectTracking} from "src/backend/ioConnector/tracking";
import {globalAccounts} from "src/contractObjects/ESPMObjects";
import {espmnft} from 'src/contractObjects/ESPMObjects';

/*
Every request should be in the format:
{
  auth: {
    userId: 'xxx'
    password: 'xxx'
  },
  body: {
  }
}
 */

function connectIO(server, db) {
    let io = require('socket.io')(server);

    new Promise((resolve, reject) => {
      resolve();
    }).then(() => {
      io.on('connection',
        (socket) => {
          console.log('Client connected.');
          connectUser(socket, db);
          connectTracking(socket, db);
        }
      );
    });
}

export default connectIO;
export {connectIO};