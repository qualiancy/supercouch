var _ = require('./util')
  , Request = require('./request');

var actions = {
    'all dbs'       : 'GET'
  , 'active tasks'  : 'GET'
  , 'replicate'     : 'POST'
  , 'uuids'         : 'GET'
  , 'restart'       : 'POST'
  , 'stats'         : 'GET'
  , 'log'           : 'GET'
};

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

Couch.prototype.request = function (method, _url, fn) {
  var opts = _.merge({
      method: method
    , path: [ _url ]
  }, this.reqOpts);

  var req = new Request(opts);
  if (_.isFn(fn)) req.end(fn);
  return req;
};

Couch.prototype.dbAdd = function (name, fn) {
  var opts = _.merge({
      method: 'PUT'
    , path: [ name ]
  }, this.reqOpts);

  var req = new Request(opts);
  if (_.isFn(fn)) req.end(fn);
  return req;
};

Couch.prototype.dbDel = function (name, fn) {
  var opts = _.merge({
      method: 'DELETE'
    , path: [ name ]
  }, this.reqOpts);

  var req = new Request(opts);
  if (_.isFn(fn)) req.end(fn);
  return req;
};

Couch.prototype.dbInfo = function (name, fn) {
  var opts = _.merge({
      method: 'GET'
    , path: [ name ]
  }, this.reqOpts);

  var req = new Request(opts);
  if (_.isFn(fn)) req.end(fn);
  return req;
};

Couch.prototype.action = function (name, body, fn) {
  if (!actions[name])
    throw new Error('Couch action `' + name + '` not valid');

  if (_.isFn(body)) fn = body, data = {};

  var method = actions[name]
    , path = '_' + name.split(' ').join('_')
    , opts = _.merge({
        method: method
      , path: [ path ]
      , body: body
    }, this.reqOpts);

  var req = new Request(opts);
  if (_.isFn(fn)) req.end(fn);
  return req;
};
