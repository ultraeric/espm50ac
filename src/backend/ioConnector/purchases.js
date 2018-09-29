import products from 'static/data/products';
import {cleanPurchase, makePurchaseEvent, events} from "shared/objects";
import {checkAuth} from "backend/ioConnector/user";
import {sianft, siatoken} from 'src/contractObjects/SIAObjects';
import {getDate} from "src/shared/utils/timingUtils";

function connectPurchases(socket, db) {
  socket.on('/request/purchases/getProducts',
    (data) => {
      socket.emit('/response/purchases/getProducts',
        products);
    }
  );

  socket.on('/request/purchases/new',
    (data) => {
      checkAuth(data.creds.flyerNumber, data.creds.password)
        .then((user) => {
          let cleanedPurchase = cleanPurchase(data.payload);
          cleanedPurchase.tracking = [makePurchaseEvent(getDate(true, 0, 0, 0), events.ordered, 'Order submitted.')];
          cleanedPurchase.date = getDate();
          return sianft.initEscrow(cleanedPurchase.name, cleanedPurchase, data.creds.flyerNumber);
        }).then(() => {
          return sianft.getPurchases(data.creds.flyerNumber);
        }).then((purchases) => {
          socket.emit('/response/purchases/getAll', purchases);
      }).then(() => Promise.all([siatoken.numRewardTokens(data.creds.flyerNumber), siatoken.numTokens(data.creds.flyerNumber)]))
      .then((arr) => {
        socket.emit('/response/tokens/reward/get', arr[0]);
        socket.emit('/response/tokens/regular/get', arr[1]);
      });
    }
  );

  socket.on('/request/purchases/skipTime',
    (data) => {
      checkAuth(data.creds.flyerNumber, data.creds.password)
        .then((user) => {
          let purchase = data.purchase;
        });
    }
  );

  socket.on('/request/purchases/confirm',
    (data) => {
      checkAuth(data.creds.flyerNumber, data.creds.password)
        .then((user) => {
          let cleanedPurchase = cleanPurchase(data.payload);
          cleanedPurchase.tracking.push(makePurchaseEvent(getDate(true, 0, 0, 0), events.received, 'Order picked up by customer.'));
          return sianft.commitEscrow(cleanedPurchase, data.creds.flyerNumber);
        }).then(() => {
          return sianft.getPurchases(data.creds.flyerNumber);
        }).then((purchases) => {
          socket.emit('/response/purchases/getAll', purchases);
        }).then(() => Promise.all([siatoken.numRewardTokens(data.creds.flyerNumber), siatoken.numTokens(data.creds.flyerNumber)]))
        .then((arr) => {
          socket.emit('/response/tokens/reward/get', arr[0]);
          socket.emit('/response/tokens/regular/get', arr[1]);
        });
    }
  );

  socket.on('/request/purchases/getAll',
    (data) => {
      checkAuth(data.creds.flyerNumber, data.creds.password)
        .then((user) => {
          return sianft.getPurchases(data.creds.flyerNumber);
        }).then((purchases) => {
        socket.emit('/response/purchases/getAll', purchases);
      });
    }
  );
}

export default connectPurchases;
export {connectPurchases};