import express from 'express';

function bindSSLRedirect(redirect, port=80) {
  var server = express();
  server.get('*', function(req, res) {
    res.redirect(redirect);
  });
  server.listen(port);
}

function bindBaseAppRedirect(app, port=80, ssl=true) {
  app.get('*', function(req, res) {
    var protocol = ssl ? 'https' : 'http';
    res.redirect(protocol + '://'  + req.hostname + ':' + port);
  });
}

export default bindSSLRedirect;
export {bindSSLRedirect,
        bindBaseAppRedirect};
