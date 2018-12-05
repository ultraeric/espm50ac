import { espmtoken, globalAccounts, espmnft } from 'src/contractObjects/ESPMObjects';
import { checkAuth } from './user';
import { cleanPurchase, events, makePurchaseEvent } from "src/shared/objects";
import { getDate } from "src/shared/utils/timingUtils";


function connectTracking(socket, db) {
  socket.on('/request/tracking/new',
    (data) => {
      checkAuth(data.auth.userId, data.auth.password, db)
        .then((user) => {
          let cleanedPurchase = cleanPurchase(data.item);
          cleanedPurchase.tracking = [makePurchaseEvent(getDate(true, 0, 0, 0), events.created, 'New product created.')];
          cleanedPurchase.date = getDate();
          return espmnft.initEscrow(cleanedPurchase.name, cleanedPurchase, data.auth.userId);
        }).then(() => {
          return espmnft.getTracking(data.auth.userId);
        }).then((purchases) => {
          socket.emit('/response/tracking/getAll', purchases);
          console.log('Created new tracked item.');
        });
    });

  socket.on('/request/tracking/update',
    (data) => {
      checkAuth(data.auth.userId, data.auth.password, db)
        .then((user) => {
          let cleanedPurchase = cleanPurchase(data.item);
          cleanedPurchase.tracking.push(makePurchaseEvent(getDate(true, 0, 0, 0), events.edited, data.message));
          console.log(cleanedPurchase);
          return espmnft.changeEscrow(cleanedPurchase, data.auth.userId);
        }).then(() => {
          return espmnft.getTracking(data.auth.userId);
        }).then((purchases) => {
          socket.emit('/response/tracking/getAll', purchases);
          console.log('Edited tracked item');
        });
    });

  socket.on('/request/tracking/commit', (data) => {
    checkAuth(data.auth.userId, data.auth.password, db)
      .then((user) => {
        let cleanedPurchase = cleanPurchase(data.item);
        cleanedPurchase.tracking.push(makePurchaseEvent(getDate(true, 0, 0, 0), events.recycled, 'Recycled. Rewards distributed.'));
        return espmnft.commitEscrow(cleanedPurchase, data.auth.userId);
      }).then(() => {
        return espmnft.getTracking(data.auth.userId);
      }).then((purchases) => {
        socket.emit('/response/tracking/getAll', purchases);
        console.log('Committed tracked item');
      }).then(() => espmtoken.numTokens(data.auth.userId))
      .then((numTokens) => {
        socket.emit('/response/tokens/get', numTokens);
      });
  });

  socket.on('/request/tracking/getAll',
    (data) => {
      checkAuth(data.auth.userId, data.auth.password)
        .then((user) => {
          return espmnft.getTracking(data.auth.userId);
        }).then((purchases) => {
        socket.emit('/response/tracking/getAll', purchases);
      });
    }
  );
}

export default connectTracking;
export{ connectTracking };