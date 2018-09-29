import {connectUser} from 'backend/ioConnector/user';
import {connectClaims} from "backend/ioConnector/claims";
import {connectPurchases} from "backend/ioConnector/purchases";
import {globalAccounts} from "src/contractObjects/SIAObjects";
import {sianft} from 'src/contractObjects/SIAObjects';
import {products} from "static/data/products";

function connectIO(server, db) {
    let io = require('socket.io')(server);

    new Promise((resolve, reject) => {
      globalAccounts.register('1932441370');
      globalAccounts.register('2367385123');
      globalAccounts.register('5918588234');
      globalAccounts.register('9136902546');
      globalAccounts.register('1406653224');
      globalAccounts.register('5520271747');
      globalAccounts.register('1864622874');
      globalAccounts.register('2595968333');
      globalAccounts.register('2342245929');
      resolve();
    }).then(() => {
      let creationPromises = []
      for (let _=0; _ < 10; _++) {
        for (let product of products) {
          creationPromises.push(sianft.mint(product.name, '{}'));
        }
      }
      return Promise.all(creationPromises).then(() => console.log('Finished creating all NFTs'));
    }).then(() => {
      io.on('connection',
        (socket) => {
          console.log('Client connected.');
          connectUser(socket, db);
          connectClaims(socket, db);
          connectPurchases(socket, db);
        }
      );
    });
}

export default connectIO;
export {connectIO};