var agent = require('superagent');

var _ = require('./util');

module.exports = Request;

function Request (opts) {
  opts = opts || {};
  this.method = opts.method;
  this.base = opts.base;
  this.path = opts.path || [];
  this.qs = opts.qs || {};
  this.body = opts.body;
}

Request.extend = _.extend;

Request.prototype.end = function (cb) {
  var self = this
    , method = this.method.toUpperCase()
    , req;

  if ('GET' === method) {
    var url = buildUrl.call(this);
    req = agent.get(url);
  } else if ('POST' === method) {
    var url = buildUrl.call(this);
    req = agent.post(url);
  } else if ('PUT' === method) {
    var url = buildUrl.call(this);
    req = agent.put(url);
  } else if ('DEL' === method) {
    var url = buildUrl.call(this);
    req = agent.del(url);
  } else {
    return cb(new Error('Unsuppored request method'));
  }

  req.end(function makeRequest (res) {
    var json
      , resErr = null;

    try {
      json = JSON.parse(res.text);
    } catch (ex) {
      resErr = ex;
    }

    // TODO: implement custom CouchError
    if (json.error) resErr = json;

    if (resErr) return cb(resErr);
    cb(null, json);
  });
};

function buildUrl () {
  this.path
    .join('/')
    .split('/')
    .filter(function (part) {
      return !!!part.trim.length;
    });

  var path = (this.path.length === 1 && this.path[0] == '/')
    ? ''
    : this.path.join('/');

  return this.base + '/' + path;
}
