let catchError = function(promise) {
  return promise.then(result => [null, result])
      .catch(err => [err]);
};

module.exports = {
    catchError
};
