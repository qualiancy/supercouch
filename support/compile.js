/*!
 * SuperCouch - browser build tool
 * Copyright (c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

console.log('\n  \u001b[90mSUPERCOUCH BROWSER BUILD\u001b[0m\n');

/*!
 * Script dependancies
 */

var fs = require('fs')
  , path = require('path')
  , join = path.join

/*!
 * Read input file
 */

console.log('  \u001b[34mreading  ::  lib/supercouch.js\u001b[0m');
var raw = fs.readFileSync(join(__dirname, '..', 'lib/supercouch.js'), 'utf8');

/*!
 * Extract Browser Code
 */

console.log('  \u001b[34mparsing  ::  lib/supercouch.js\u001b[0m');
var endBrowser = false
  , src = raw
    .split('\n')
    .filter(function (line) {
      if (endBrowser) return false;
      if (line.trim() == '// == END BROWSER ==') {
        endBrowser = true;
        return false;
      }
      return true;
    });

src.push('}({}, superagent);');
src = src.join('\n');

/*!
 * Minify
 */

console.log('  \u001b[34mminify   ::  supercouch.js\u001b[0m');

var uglify = require('uglify-js')
  , jsp = uglify.parser
  , pro = uglify.uglify
  , orig = src
  , ast = jsp.parse(orig)
  , min;

ast = pro.ast_mangle(ast);
ast = pro.ast_squeeze(ast);
min = pro.gen_code(ast);

/*!
 * Save normal version
 */

console.log('\n  \u001b[35msaving   ::  supercouch.js\u001b[0m');
fs.writeFileSync(join(__dirname, '..', 'supercouch.js'), src, 'utf8');

/*!
 * Save minified version
 */

var notice = [
    '/*!'
  , ' * SuperCouch'
  , ' * Copyright (c) 2012 Jake Luer <jake@qualiancy.com>'
  , ' * MIT Licensed'
  , ' *'
  , ' * @website http://supercou.ch'
  , ' * @issues https://github.com/qualiancy/supercouch/issues'
  , ' */\n'
].join('\n')

console.log('  \u001b[35msaving   ::  supercouch.min.js\u001b[0m');
fs.writeFileSync(join(__dirname, '..', 'supercouch.min.js'), notice + min, 'utf8');

/*!
 * All done!
 */

console.log('\n  \u001b[32mSUCCESS!\u001b[0m\n');
