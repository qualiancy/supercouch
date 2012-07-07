var http = require('http')
  , join = require('path').join
  , send = require('send');

var server = http.createServer(function(req, res){
  send(req.url)
    .root(join(__dirname, 'out'))
    .pipe(res);
});

if (require.main == module) {
  server.listen(3441);
  console.log('supercouch doc server listening on port %d', server.address().port);
}
