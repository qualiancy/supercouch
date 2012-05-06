

module.exports = Request;

function Request (agent, opts) {
  this.agent = agent;

  opts = opts || {};
  this.method = opts.method;
  this.base = opts.base;
  this.path = opts.path || '/';
  this.qs = opts.qs || [];
  this.body = opts.body;
}

Request.prototype.end = function (cb) {
  var self = this
    , agent = this.agent
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
  return this.base + this.path;
}
