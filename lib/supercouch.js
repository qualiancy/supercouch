
var Couch = require('./supercouch/couch');

var exports = module.exports = function (address, opts) {
  return new Couch(address, opts);
}

exports.version = '0.0.0';
