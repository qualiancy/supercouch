var _ = require('./util')
  , Request = require('./request');

var actions = {
    'changes'             : 'GET'
  , 'compact'             : 'POST'
  , 'view cleanup'        : 'POST'
  , 'temp view'           : 'POST'
  , 'ensure full commit'  : 'POST'
  , 'purge'               : 'POST'
};

module.exports = Db;

function Db (opts) {
  opts = opts || {};
  this.reqOpts = opts;
}

Db.prototype.insert = function (body, fn) {
  if (_.isFn(obj)) fn = body, body = {};

  var opts = _.merge({
      method: 'POST'
    , body: {}
  }, this.reqOpts);

  var req = new Request(opts);
  if (_.isFn(fn)) req.end(fn);
  return req;
};

Db.prototype.get = function (id, rev, fn) {
  if (_.isFn(rev)) fn = rev, rev = null;

  var opts = _.merge({
      method: 'GET'
  }, this.reqOpts);

  opts.path.push(id);
  if (rev) opts.qs = [ { rev: rev } ];

  var req = new Request(opts);
  if (_.isFn(fn)) req.end(fn);
  return req;
};

Db.prototype.set = function (id, rev, obj, fn) {
  if (_.isObj(rev)) fn = obj, obj = rev, rev = null;

  var opts = _.merge({
      method: 'PUT'
    , body = obj
  }, this.reqOpts);

  opts.path.push(id);
  if (rev) opts.qs = [ { rev: rev } ];

  var req = new Request(opts);
  if (_.isFn(fn)) req.end(fn);
  return req;
};

Db.prototype.action = function (name, body, fn) {
  if (!actions[name])
    throw new Error('Couch action `' + name + '` not valid');

  if (isFn(body)) fn = body, data = {};

  var method = actions[name]
    , path = '_' + name.split(' ').join('_')
    , opts = _.merge({
        method: method
      , body: body
    }, this.reqOpts);

  opts.path.push(path);
  var req = new Request(opts);
  if (_.isFn(fn)) req.end(fn);
  return req;
};
