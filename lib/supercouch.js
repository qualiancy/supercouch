
var supercouch = function (exports, agent) {

  exports = function (address) {
    return new Couch(address);
  }

  exports.version = '0.0.0';

  function isFn (fn) {
    return fn && 'function' === typeof fn;
  }

  function isObj (obj) {
    return obj && 'object' === typeof obj;
  }

  function isArray (arr) {
    '[object Array]' === {}.toString.call(arr);
  }

  function merge (a, b){
    if (a && b) {
      for (var key in b) {
        a[key] = b[key];
      }
    }
    return a;
  }

  function defaults (a, b) {
    if (a && b) {
      for (var key in b) {
        if ('undefined' == typeof a[key]) a[key] = b[key];
      }
    }
    return a;
  }

  function Request (opts) {
    opts = opts || {};
    this.method = opts.method;
    this.base = opts.base;
    this.path = opts.path || [];
    this.qs = opts.qs || {};
    this.body = opts.body;
  }

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
    } else if ('DELETE' === method) {
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
    var opts = merge({
        method: method
      , path: [ _url ]
    }, this.reqOpts);

    var req = new Request(opts);
    if (isFn(fn)) req.end(fn);
    return req;
  };

  Couch.prototype.dbAdd = function (name, fn) {
    var opts = merge({
        method: 'PUT'
      , path: [ name ]
    }, this.reqOpts);

    var req = new Request(opts);
    if (isFn(fn)) req.end(fn);
    return req;
  };

  Couch.prototype.dbDel = function (name, fn) {
    var opts = merge({
        method: 'DELETE'
      , path: [ name ]
    }, this.reqOpts);

    var req = new Request(opts);
    if (isFn(fn)) req.end(fn);
    return req;
  };

  Couch.prototype.dbInfo = function (name, fn) {
    var opts = merge({
        method: 'GET'
      , path: [ name ]
    }, this.reqOpts);

    var req = new Request(opts);
    if (isFn(fn)) req.end(fn);
    return req;
  };

  Couch.prototype.db = function (name) {
    var opts = merge({
      path: [ name ]
    }, this.reqOpts);

    var db = new Db(opts);
    return db;
  };

  Couch.prototype.action = function (name, body, fn) {
    var actions = {
        'all dbs'       : 'GET'
      , 'active tasks'  : 'GET'
      , 'replicate'     : 'POST'
      , 'uuids'         : 'GET'
      , 'restart'       : 'POST'
      , 'stats'         : 'GET'
      , 'log'           : 'GET'
    };

    if (!actions[name])
      throw new Error('Couch action `' + name + '` not valid');

    if (isFn(body)) fn = body, data = {};

    var method = actions[name]
      , path = '_' + name.split(' ').join('_')
      , opts = merge({
          method: method
        , path: [ path ]
        , body: body
      }, this.reqOpts);

    var req = new Request(opts);
    if (isFn(fn)) req.end(fn);
    return req;
  };

  function Db (opts) {
    opts = opts || {};
    this.reqOpts = opts;
  }

  Db.prototype.insert = function (body, fn) {
    if (isFn(obj)) fn = body, body = {};

    var opts = merge({
        method: 'POST'
      , body: {}
    }, this.reqOpts);

    var req = new Request(opts);
    if (isFn(fn)) req.end(fn);
    return req;
  };

  Db.prototype.get = function (id, rev, fn) {
    if (isFn(rev)) fn = rev, rev = null;

    var opts = merge({
        method: 'GET'
    }, this.reqOpts);

    opts.path.push(id);
    if (rev) opts.qs = [ { rev: rev } ];

    var req = new Request(opts);
    if (isFn(fn)) req.end(fn);
    return req;
  };

  Db.prototype.set = function (id, rev, obj, fn) {
    if (isObj(rev)) fn = obj, obj = rev, rev = null;

    var opts = merge({
        method: 'PUT'
      , body: obj
    }, this.reqOpts);

    opts.path.push(id);
    if (rev) opts.qs = [ { rev: rev } ];

    var req = new Request(opts);
    if (isFn(fn)) req.end(fn);
    return req;
  };

  Db.prototype.action = function (name, body, fn) {
    var actions = {
        'changes'             : 'GET'
      , 'compact'             : 'POST'
      , 'view cleanup'        : 'POST'
      , 'temp view'           : 'POST'
      , 'ensure full commit'  : 'POST'
      , 'purge'               : 'POST'
    };

    if (!actions[name])
      throw new Error('Couch action `' + name + '` not valid');

    if (isFn(body)) fn = body, data = {};

    var method = actions[name]
      , path = '_' + name.split(' ').join('_')
      , opts = merge({
          method: method
        , body: body
      }, this.reqOpts);

    opts.path.push(path);
    var req = new Request(opts);
    if (isFn(fn)) req.end(fn);
    return req;
  };

  return exports;
  // == END BROWSER ==
};


var superagent = require('superagent');
module.exports = supercouch({}, superagent);
