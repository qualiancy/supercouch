/*!
 * SuperCouch - Node.js Bootstrap
 * Copyright (c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module Dependancies
 */

var superagent = require('superagent');

/*!
 * Supercouch Internal Dependancies
 */

var supercouch = require('./supercouch')

/*!
 * Primary Export
 */

module.exports = supercouch(superagent);
