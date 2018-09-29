import express from 'express';
import favicon from 'serve-favicon';
import {MongoClient, ObjectID} from 'mongodb';
import path from 'path';

import https from 'https';

import {bindSSLRedirect, bindBaseAppRedirect} from './redirectUtils';
import {sendBaseApp, sendGZippedFiles} from './responseUtils';

var port = process.env.PORT || 8080;

const app = express();
const sslServer = https.createServer(credentials, app);

app.use(favicon(path.join(__dirname, '/../public/static/images/logos/favicon.ico')));
app.get('/*.js', sendGZippedFiles);
app.get('/*.css', sendGZippedFiles);
app.get('/', sendBaseApp);
app.use(express.static('public'));

bindBaseAppRedirect(app);
bindSSLRedirect('https://' + req.hostname + ':' + sslPort, port);

sslServer.listen(sslPort,
  () => console.log('Node/express SSL server started on port ' + sslPort)
);
