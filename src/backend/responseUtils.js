/** File transformation libraries **/
import zlib from 'zlib';
import fs from 'fs';

function refreshGlobal() {
  global.window = {
    addEventListener: () => {},
    scrollTo: () => {},
    innerWidth: 1200,
    innerHeight: 800,
    isServer: true
  };
  global.document = {
    addEventListener: () => {}
  };
}
refreshGlobal();

/** Application imports. Do this because of hoisting + globals **/
const AppComponent = require('frontend/App').default;

/** Imports for React server-side rendering **/
import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import {StaticRouter} from 'react-router';

// Zipped
function sendBaseApp(req, res, next) {
  fs.readFile(__dirname + '/../public/index.html', 'utf8', function (error, docData) {
    if (error) throw error;
    res.writeHead(200, {'Content-Type': 'text/html', 'Content-Encoding': 'gzip'});
    // const AppElement = ReactDOMServer.renderToString(
    //                     <StaticRouter location={req.url} context={{}}>
    //                       <AppComponent/>
    //                     </StaticRouter>
    //                   );
    // docData = docData.replace(/<div id="app"><\/div>/,`<div id="app">${AppElement}</div>`);
    zlib.gzip(docData, function (_, result) {
      res.end(result);
    });
  });
}

function sendGZippedFiles(req, res, next) {
  var contentType = '';
  if (req.url.endsWith('.css'))     { contentType = 'text/css'; }
  else if (req.url.endsWith('js'))  { contentType = 'application/javascript'; }

  res.set('Content-Type', contentType);
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
}

export default sendBaseApp;
export {sendBaseApp, sendGZippedFiles};