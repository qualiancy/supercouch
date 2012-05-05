module.exports = (process && process.env && process.env.SUPERCOUCH_COV)
  ? require('./lib-cov/supercouch')
  : require('./lib/supercouch');
