/*server.js*/


const http = require('http');
const url = require('url');
const fs = require('fs');
const mimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "png": "image/png",
  "ico": "image/ico",
  "svg": "image/svg+xml",
  "json": "application/json",
  "js": "text/javascript",
  "css": "text/css"
};

const hostname = '127.0.0.1';

const port = 80;

const pathIndex = "./index.html";

const server = http.createServer(function(req, res) {

    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;
    if (filename == "./") filename = pathIndex;
    fs.readFile(filename, function(err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("404 Not Found");
      } 
      console.log("Ressource demandée = " + req.url + " type mime associé = " + mimeTypes[filename.split('.').pop()]);
      res.writeHead(200, {'Content-Type': mimeTypes[filename.split('.').pop()]});
      res.write(data);
      return res.end();
    });

});

server.listen(port, hostname, function() {

  console.log('Server running at http://'+ hostname + ':' + port + '/');

});