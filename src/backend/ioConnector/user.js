import { espmtoken, globalAccounts, espmnft } from 'src/contractObjects/ESPMObjects';

function checkAuth(userId, password, db) {
  if (userId === password) {
    return db.users
      .findUser(userId)
      .then((user) => {
        if (user) {
          return {userId: userId}
        } else {
          return db.users
            .addUser({userId: userId})
            .then(() => {
              return globalAccounts.register(userId)
                .then((acct) => {
                  return {userId: userId};
                });
            });
        }
      }).then((user) => {
        console.log('Registered user ' + user.userId);
        return espmtoken.numTokens(user.userId)
          .then((numTokens) => {
            user.numTokens = numTokens;
            return user;
          });
      });
  } else {
    socket.emit('/response/login', {success: false, message: 'The user and password do not match.'})
  }
}

function connectUser(socket, db) {
    socket.on('/request/login',
        (data) => {
            checkAuth(data.auth.userId, data.auth.password, db).then(
              (user) => {
                socket.emit('/response/login', {user: user, success: true, message: 'Successfully logged in.'});
              }
            );
        });
}

export default connectUser;
export{ connectUser, checkAuth };