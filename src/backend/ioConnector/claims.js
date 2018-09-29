import {checkAuth} from "backend/ioConnector/user";
import {cleanClaim} from "shared/objects";
import {requestSentiment} from "backend/nlp";
import {siatoken} from "src/contractObjects/SIAObjects";

function connectClaims(socket, db) {
  socket.on('/request/claims/create',
    (data) => {
      let claimPromise = checkAuth(data.creds.flyerNumber, data.creds.password)
        .then((body) => {
          // Clean the claim, then ensure that all experience parameters match the known parameters
          let submittedClaim = cleanClaim(data.payload);
          let calculatedClaimAmount = 0;
          if (submittedClaim.flyerNumber !== data.creds.flyerNumber) {
            throw(new Error('Accessing wrong account'));
          }
          for (let exp of body.response.passengerExperienceHistory) {
            if (exp.flightNumber === submittedClaim.flightNumber) {
              calculatedClaimAmount = exp.category.length;
            }
          }
          if (calculatedClaimAmount !== submittedClaim.amount) {
            throw(new Error('Claim amounts not matching'));
          }
          return cleanClaim(data.payload);
        })
        .then((claim) => {
          // Search for existence of the filed claim already
          let claimQuery = {flyerNumber: claim.flyerNumber, flightNumber: claim.flightNumber};
          return Promise.all([db.claims.findClaim(claimQuery), claim]);
        })
        .then((arr) => {
          if (arr[0]) { throw(new Error('Claim already exists.')); }
          return arr[1];
        })
        .then((claim) => {
          // Get sentiment from Google, and use it to affect amount paid out
          return requestSentiment(claim.userFeedback)
            .then((obj) => {
              if (obj.score < 0.3) {
                claim.amount *= (1.5 - obj.score * obj.magnitude);
              }
              claim.amount = Math.round(claim.amount);
              return claim;
            });
        })
        .then((claim) => {db.claims.addClaim(claim); return claim});
      claimPromise.then((claim) => siatoken.mint(data.creds.flyerNumber, claim.amount))
        .then(() => siatoken.numRewardTokens(data.creds.flyerNumber))
        .then((numRewardTokens) => socket.emit('/response/tokens/reward/get', numRewardTokens));
      claimPromise.then(() => socket.emit('/response/claims/created', {success: true}))
        .catch((err) => {
          socket.emit('/response/claims/created', {success: false});
          throw(err);
        })
        .then(() => db.claims.getClaims(data.creds.flyerNumber))
        .then((claims) => socket.emit('/response/claims/getAll', claims))
        .catch((err) => {throw(err)});
    }
  );

  socket.on('/request/claims/find',
    (data) => {

    }
  );

  socket.on('/request/claims/getAll',
    (data) => {
      checkAuth(data.creds.flyerNumber, data.creds.password)
        .then((body) => db.claims.getClaims(data.creds.flyerNumber))
        .then((claims) => socket.emit('/response/claims/getAll', claims))
        .catch((err) => {throw(err)});
    }
  );
}

export default connectClaims;
export {connectClaims};