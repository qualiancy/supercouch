/*!
 * SuperCouch
 * Copyright (c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 *
 * @website http://supercou.ch
 * @issues https://github.com/qualiancy/supercouch/issues
 */

/*!
 * Context loader
 */

var supercouch = function (exports, agent) {

  /*!
   * Main Export
   */

  exports = function (address) {
    return new Couch(address);
  }

  /*!
   * SupeCouch version
   */

  exports.version = '0.0.0';

  /*!
   * toString utility
   *
   * Provided as variable for easier browser minification.
   *
   * @param {Object} object to test
   * @api private
   */

  var toString = Object.prototype.toString;

  /*!
   * isFn utility
   *
   * @param {Function} fn
   * @api private
   */

  function isFn (fn) {
    return '[object Function]' === toString.call(fn);
  }

  /*!
   * isObj utility
   *
   * @param {Object} fn
   * @api private
   */

  function isObj (obj) {
    return obj === Object(obj);
  }

  /*!
   * isArray utility
   *
   * @param {Array} fn
   * @api private
   */

  var isArray = Array.isArray || function (arr) {
    return '[object Array]' === toString.call(arr);
  };

  /*!
   * indexOf utility
   *
   * IE8 doesn't have indexOf. Defaults to "native"
   * Array.prototype.indexOf if it exists.
   *
   * @ctx {Array}
   * @param {Mixed} item to look for
   * @param {Number} start index
   */

  var indexOf = Array.prototype.indexOf || function (obj, start) {
     for (var i = (start || 0), j = this.length; i < j; i++)
       if (this[i] === obj) return i;
     return -1;
  }

  /*!
   * merge utility
   *
   * @param {Object} a
   * @param {Object} b
   * @api private
   */

  function merge (a, b){
    if (a && b) {
      for (var key in b) {
        a[key] = b[key];
      }
    }
    return a;
  }

  /*!
   * defaults utility
   *
   * @param {Object} a
   * @param {Object} b
   * @api private
   */

  function defaults (a, b) {
    if (a && b) {
      for (var key in b) {
        if ('undefined' == typeof a[key]) a[key] = b[key];
      }
    }
    return a;
  }

  /**
   * ## The Foundation of Requests
   *
   * Constructs the final request and interacest
   * with superagent.
   *
   * @header API Basics
   */

  function Request (opts) {
    /*!
     * @param {Object} options
     * @api public
     */

    opts = opts || {};
    this.reqOpts = opts;
  }

  /**
   * ### end(callback);
   *
   * Contructs all the given parameters
   * in a request, sends reqest to superagent,
   * parses results, and sends appropriate values
   * back to callback
   *
   * @param {Function} callback
   * @api public
   * @name end
   */

  Request.prototype.end = function (cb) {
    var self = this
      , opts = this.reqOpts
      , url = buildUrl.call(this)
      , method = opts.method.toUpperCase()
      , req;

    if ('GET' === method) req = agent.get(url);
    else if ('POST' === method) req = agent.post(url);
    else if ('PUT' === method) req = agent.put(url);
    else if ('DELETE' === method) req = agent.del(url);
    else if ('HEAD' === method) req = agent.head(url);
    else return cb(new Error('Unsuppored request method'));

    if (opts.body) req.send(opts.body);

    req.end(function makeRequest (res) {
      var json
        , resErr = null;

      if (method === 'HEAD') {
        var val = (opts.validate)
          ? opts.validate(res)
          : res.status !== 404;
        return cb(null, val);
      }

      try { json = JSON.parse(res.text); }
      catch (ex) { resErr = ex; }

      // TODO: implement custom CouchError
      if (!resErr && json.error) resErr = json;
      if (resErr) return cb(resErr);
      var val = (isFn(opts.validate))
        ? opts.validate(json)
        : json;
      cb(null, val);
    });
  };

  /*!
   * buildUrl
   *
   * Takes all parameters in a constructed
   * Request and builds the appropriate url.
   *
   * @context {Request}
   * @api private
   */

  function buildUrl () {
    var opts = this.reqOpts
    opts.path
      .join('/')
      .split('/')
      .filter(function (part) {
        return !!!part.trim.length;
      });

    var path = (opts.path.length === 1 && opts.path[0] == '/')
      ? ''
      : opts.path.join('/');

    return opts.base + '/' + path;
  }

  /**
   * ## Managing CouchDB Services & Databases
   *
   * The first exposed object in the chainable
   * API. Exposes methods to interact on with
   * server level events. Also, some methods
   * will construct Requests, while others will
   * construct the next level chainable objects.
   *
   * @header Managing CouchDB
   */

  function Couch (address, opts) {
    /*!
     * @param {String} address
     * @param {Object} options
     * @api private
     */

    if ('object' === typeof address) {
      opts = address;
      address = 'http://localhost:5984';
    }

    opts = opts || {};
    this.reqOpts = {
      base: address || 'http://localhost:5984'
    }
  };

  /**
   * ### request(method, url[, callback])
   *
   * Helper method to directly create Requests
   * to the server. Useful for any urls that might
   * not be included in the chainable api.
   *
   * Providing a callback will immediately execute
   * the request.
   *
   * @param {String} method
   * @param {String} url
   * @param {Function} callback (optional)
   * @returns {Request} constructed request
   * @api public
   * @name request
   */

  Couch.prototype.request = function (method, _url, fn) {
    var opts = merge({
        method: method
      , path: [ _url ]
    }, this.reqOpts);

    var req = new Request(opts);
    if (isFn(fn)) req.end(fn);
    return req;
  };

  /**
   * ### action(name[, body[, callback]])
   *
   * Constructs a request that performs an CouchDb action
   * on the server. If the name of the action is not valid
   * an error will be thrown.
   *
   *     couch
   *       .action('all dbs')
   *       .end(db);
   *
   * Proving a callback will immediately execute the
   * request to the server.
   *
   * ##### Actions
   *
   * - `all dbs` - get a list of all databases
   * - `active tasks` - get a list of currenly running tasks
   * - `uuids` - get a list of all uuids generated on the server
   * - `stats` - get all couch server statistics
   * - `log` - get a tail of ther server's log file (requires admin priv)
   * - `replicate` - post a replicate command to the couch server
   * - `restart` - port a restart command to the server
   *
   * @param {String} command name
   * @param {Object} body for post commands
   * @param {Function} optional callback
   * @api public
   * @name action
   * @see http://wiki.apache.org/couchdb/Complete_HTTP_API_Reference CouchDB API Guide
   */

  Couch.prototype.action = function (name, body, fn) {
    var actions = {
        'all dbs'       : 'GET'
      , 'active tasks'  : 'GET'
      , 'uuids'         : 'GET'
      , 'stats'         : 'GET'
      , 'log'           : 'GET'
      , 'replicate'     : 'POST'
      , 'restart'       : 'POST'
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

  /**
   * ### dbAdd(name[, fn])
   *
   * Constructs a request that will add a database
   * to the CouchDb server.
   *
   *     couch
   *       .dbAdd('my_app')
   *       .end(cb);
   *
   * Providing a callback will immediately execute
   * the request.
   *
   * @param {String} db name
   * @param {Function} callback (optional)
   * @returns {Request} constructed request
   * @api public
   * @name dbAdd
   */

  Couch.prototype.dbAdd = function (name, fn) {
    var opts = merge({
        method: 'PUT'
      , path: [ name ]
    }, this.reqOpts);

    var req = new Request(opts);
    if (isFn(fn)) req.end(fn);
    return req;
  };

  /**
   * ### dbInfo(name[, fn])
   *
   * Constructs a request that will get the information
   * about a database in the CouchDb server.
   *
   *     couch
   *       .dbInfo('my_app')
   *       .end(cb);
   *
   * Providing a callback will immediately execute
   * the request.
   *
   * @param {String} db name
   * @param {Function} callback (optional)
   * @returns {Request} constructed request
   * @api public
   * @name dbInfo
   */

  Couch.prototype.dbInfo = function (name, fn) {
    var opts = merge({
        method: 'GET'
      , path: [ name ]
    }, this.reqOpts);

    var req = new Request(opts);
    if (isFn(fn)) req.end(fn);
    return req;
  };

  /**
   * ### dbExists(name[, fn])
   *
   * Constructs a request that will check if
   * database exists.
   *
   *     couch
   *       .dbExists('my_app')
   *       .end(cb);
   *
   * Providing a callback will immediately execute
   * the request.
   *
   * @param {String} db name
   * @param {Function} callback (optional)
   * @returns {Request} constructed request
   * @api public
   * @name dbExists
   */

  Couch.prototype.dbExists = function (name, fn) {
    var opts = merge({
        method: 'GET'
      , path: [ '_all_dbs' ]
      , validate: function (res) {
          return indexOf.call(res, name) > -1
        }
    }, this.reqOpts);

    var req = new Request(opts);
    if (isFn(fn)) req.end(fn);
    return req;
  };

  /**
   * ### dbDel(name[, fn])
   *
   * Constructs a request that will remove a database
   * to the CouchDb server.
   *
   *     couch
   *       .dbDel('my_app')
   *       .end(cb);
   *
   * Providing a callback will immediately execute
   * the request.
   *
   * @param {String} db name
   * @param {Function} callback (optional)
   * @returns {Request} constructed request
   * @api public
   * @name dbDel
   */

  Couch.prototype.dbDel = function (name, fn) {
    var opts = merge({
        method: 'DELETE'
      , path: [ name ]
    }, this.reqOpts);

    var req = new Request(opts);
    if (isFn(fn)) req.end(fn);
    return req;
  };

  /**
   * ### db(name)
   *
   * Contructs a Db interface for chaining actions
   * on a specific database.
   *
   * @param {String} db name
   * @returns {Db} constructed db chain api
   * @api public
   * @name db
   */

  Couch.prototype.db = function (name) {
    var opts = merge({
      path: [ name ]
    }, this.reqOpts);

    var db = new Db(opts);
    return db;
  };


  /**
   * ## Working with Specific Databases & Documents
   *
   * Provides chainable API for requests to a specific db.
   * Constructed when `.db('name')` method is performed on
   * a couch instance.
   *
   * @header Databases and Documents
   */

  function Db (opts) {
    /*!
     * @param {Object} current request options
     * @api private
     */
    opts = opts || {};
    this.reqOpts = opts;
  }

  /**
   * ### action(name[, body[, callback]])
   *
   * Constructs a request that performs an CouchDb action
   * on the currently selected database.
   *
   * If the name of the action is not valid an error will
   * be thrown.
   *
   * Proving a callback will immediately execute the
   * request to the server.
   *
   * ##### Actions
   *
   * - `changes` - gets changes for the database
   * - `compact` - post instructing the db to compact
   * - `view cleanup` - post instructing the db to perform view cleanup
   * - `temp view` - post instructing the db to execute view function (admin privileges)
   * - `ensure full commit` - post instructing the db commit all changes to disk
   * - `purge` - post instructing the db to purge history docs from db history
   *
   * @param {String} command name
   * @param {Object} body for post commands
   * @param {Function} optional callback
   * @api public
   * @name action
   * @see http://wiki.apache.org/couchdb/Complete_HTTP_API_Reference CouchDB API Guide
   */

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

  /**
   * ### insert(doc[, callback])
   *
   * Inserts a new document to the currently
   * selected database.
   *
   *     couch
   *       .db('my_app')
   *       .insert(docObj)
   *       .end(cb);
   *
   * Document is optional but should be provided
   * using the requests `send`  command in the chainable api.
   *
   *     couch
   *       .db('my_app')
   *       .insert()
   *       .send(docObj)
   *       .end(cb);
   *
   * If a callback is provided will execute the
   * insert request immediately.
   *
   * @param {Object} document
   * @param {Function} optional callback
   * @api public
   * @name insert
   */

  Db.prototype.insert = function (body, fn) {
    if (isFn(body)) fn = body, body = {};

    var opts = merge({
        method: (body._id) ? 'PUT' : 'POST'
      , body: body
    }, this.reqOpts);

    if (body._id) opts.path.push(body._id);

    var req = new Request(opts);
    if (isFn(fn)) req.end(fn);
    return req;
  };

  /**
   * ### get(id[, rev[, callback])
   *
   * Retrieves a document, optionally at a specific
   * revision, from the currently selected database.
   *
   *     couch
   *       .db('my_app')
   *       .get('123', 'rev123')
   *       .end(cb);
   *
   * Revision is optional, or can also be provided
   * using the requests `qs` method.
   *
   *     couch
   *       .db('my_app')
   *       .get('123')
   *       .qs('rev', 'rev123')
   *       .end(cb);
   *
   * If a callback is provided will execute the
   * insert request immediately.
   *
   * @param {Mixed} document id
   * @param {String} document revision
   * @param {Function} optional callback
   * @api public
   * @name get
   */

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

  /**
   * ### update([id[, rev[, doc[, callback]]]])
   *
   * Updates a document, optionally at a specific
   * revision, to the provided document object,
   * from the currently selected database.
   *
   *     couch
   *       .db('my_app')
   *       .update(123, docObj)
   *       .end(cb);
   *
   * Revision is optional. Document is also optional
   * but should be provided using the requests `send`
   * command in the chainable api.
   *
   *     couch
   *       .db('my_app')
   *       .update(123)
   *       .send(docObj)
   *       .end(cb);
   *
   * When updating the document, if you wish to
   * use an aleady existing document object, you
   * can provide that directly without specifing
   * the `id` parameter. This does _not_ work with
   * the requests `send` method.
   *
   *     couch
   *       .db('my_app')
   *       .update({
   *           _id: 123
   *         , _rev: 'rev123'
   *         , name: 'Arthur Dent'
   *       })
   *       .end(cb);
   *
   * If a callback is provided will execute the
   * insert request immediately.
   *
   * @param {Mixed} document id
   * @param {String} document revision
   * @param {Function} optional callback
   * @api public
   * @name update
   */

  Db.prototype.update = function (id, rev, obj, fn) {
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

  return exports;
  // == END BROWSER ==
  // Do not remove previous line!!
};

/*!
 * Node.js context loader providing
 * primary export for node.js integration
 */

var superagent = require('superagent');
module.exports = supercouch({}, superagent);
