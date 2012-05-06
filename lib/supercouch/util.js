var exports = module.exports = {};

exports.isFn = function (fn) {
  return fn && 'function' === typeof fn;
};

exports. isObj = function (obj) {
  return obj && 'object' === typeof obj;
};

exports.merge = function (a, b){
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};

exports.defaults = function (a, b) {
  if (a && b) {
    for (var key in b) {
      if ('undefined' == typeof a[key]) a[key] = b[key];
    }
  }
  return a;
};
