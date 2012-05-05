var request = require('superagent');

var exports = module.exports = function (options) {
  return new Couch(options);
};

exports.version = '0.0.0';

function Couch (options) {
  options = options || {};
  this.baseUrl = options.url || 'http://localhost:5984';
};

function makeRequest (_url, cb) {
  var url = this.baseUrl + _url;
  request
    .get(url)
    .end(function (res) {
      var json
        , err = null;
      try {
        json = JSON.parse(res.text);
      } catch (ex) {
        err = ex;
      }

      if (err) return cb(err);
      cb(null, json);
    });
}

Couch.prototype.version = function (cb) {
  makeRequest.call(this, '/', function (err, res) {
    cb(err, res);
  });
};
