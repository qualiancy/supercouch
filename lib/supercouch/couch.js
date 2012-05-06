var agent = require('superagent');

var Request = require('./request')
  , _ = require('./util');

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
    , path: _url
  }, this.reqOpts);

  var req = new Request(agent, opts);
  return req;
};

