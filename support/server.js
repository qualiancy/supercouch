var connect = require('connect')
  , carbon = require('carbon')
  , http = require('connect')
  , join = require('path').join;


var proxy = carbon.listen(5000)
  , app = connect();


proxy.use(function (req, res, next) {
  var url = req.url.split('/');
  if (url[1] === '_couchdb') {
    req.url = '/' + url.slice(2).join('/');
    return next(5984);
  }
  next(5001);
});

app.use(connect.static(join(__dirname, '..')));
http.createServer(app).listen(5001);

console.log('supercouch test server running on port %d', proxy.server.address().port);
