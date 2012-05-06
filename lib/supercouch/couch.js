var _ = require('./util')
  , Request = require('./request')
  , DocRequest = require('./reqs/doc');

module.exports = Couch;

function Couch (address, opts) {
  if ('object' === typeof address) {
    opts = address;
    address = 'http://localhost:5984';
  }

  opts = opts || {};
  this.reqOpts = {
    base: address || 'http://localhost:5984'
  }
};

Couch.prototype.request = function (method, _url) {
  var opts = _.merge({
      method: method
    , path: [ _url ]
  }, this.reqOpts);

  var req = new Request(opts);
  return req;
};

Couch.prototype.db = function (db) {
  var opts = _.merge({
    path: [ db ]
  }, this.reqOpts);

  var req = new DocRequest(opts);
  return req;
};

