import rp from 'request-promise-native';
import { createSiaRequest } from 'backend/ioConnector/createRequest';
import { siatoken } from 'src/contractObjects/SIAObjects';
import { sianft } from "src/contractObjects/SIAObjects";

function checkAuth(flyerNumber, password) {
  const requestBody = {
    'krisflyerNumber': flyerNumber.toString()
  };
  return rp(createSiaRequest('https://apigw.singaporeair.com/appchallenge/api/krisflyer/profile', requestBody))
    .then((body) => {
      if (body.response === 'Invalid Input Parameter Values') {
        throw(new Error('Invalid Input Parameter Values'));
      } else if (password === body.response.contact.phoneNumber) {
        body.response.flyerNumber = flyerNumber;
        for (let exp of body.response.passengerExperienceHistory) {
          for (let key of Object.keys(exp)) {
            if (key.includes('flightNumber')) {
              exp.flightNumber = exp[key];
            }
          }
        }
        return body;
      } else {
        throw(new Error('User could not be fetched'));
      }
    }).then((body) => {
      return Promise.all([siatoken.numRewardTokens(flyerNumber), siatoken.numTokens(flyerNumber), body]);
    }).then((arr) => {
      let body = arr[2];
      let user = body.response;
      user.rewardTokens = arr[0];
      user.tokens = arr[1];
      return body;
    });
}

function connectUser(socket, db) {
    socket.on('/request/login',
        (data) => {
            // let flyerNumber = data.flyerNumber;
            // let password = data.password;
            let flyerNumber = '5918588234';
            let password = '3212781351';

            checkAuth(flyerNumber, password)
              .then((body) => Promise.all([body, db.claims.getClaims(flyerNumber)]))
              .then((arr) => { socket.emit('/response/claims/getAll', arr[1]); return arr[0]})
              .then((body) => { return Promise.all([body, sianft.getPurchases(flyerNumber)]) })
              .then((arr) => {
                let body = arr[0];
                let purchases = arr[1];
                if (password === body.response.contact.phoneNumber) {
                  socket.emit('/response/purchases/getAll', purchases);
                  socket.emit('/response/login', {success: true, message: 'Logged in successfully.', user: body.response});
                } else {
                  throw(new Error('Incorrect credentials'));
                }
              }).catch((err) => {
                socket.emit('/response/login', {success: false, message: 'Credentials incorrect. Please log in again.'});
                throw(err);
              });
        });
}

export default connectUser;
export{ connectUser, checkAuth };