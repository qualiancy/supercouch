var superagent = require('superagent');

var supercouch = require('./supercouch')

module.exports = supercouch(superagent);
