import express from 'express';
import connectIO from 'backend/ioConnector/ioConnector';
import DatabaseConnector from 'backend/dbConnector/DatabaseConnector';

import http from 'http';

import {bindBaseAppRedirect} from './redirectUtils';
import {sendBaseApp, sendGZippedFiles} from './responseUtils';

var port = process.env.PORT || 8081;

const app = express();
const server = http.createServer(app);
const dbConnector = new DatabaseConnector();
connectIO(server, dbConnector);

// app.use(favicon(path.join(__dirname, '/../public/static/images/logos/favicon.ico')));
app.get('/*.js', sendGZippedFiles);
app.get('/*.css', sendGZippedFiles);
app.get('/', sendBaseApp);
app.use(express.static('./public'));
app.get('*', sendBaseApp);

bindBaseAppRedirect(app, 80, false);

server.listen(port,
  () => console.log('Node/express test server started on port ' + port)
);
