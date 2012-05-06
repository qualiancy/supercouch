/*!
 * chai-spies :: browser build script
 * Copyright (c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Script dependancies
 */

var fs = require('fs')
  , path = require('path')
  , join = path.join
  , folio = require('folio');

/*!
 * Script variables
 */

var appfiles = []
  , basepath = join(__dirname, '..', 'lib');

var superagent = new folio.Glossary([
    require.resolve('superagent/superagent.js')
], {
    prefix: '\nrequire.register("superagent", function (module, exports, require) {\n'
  , suffix: 'module.exports = superagent;\n});'
});

appfiles.push(superagent);

/**
 * Recursively iterate through a given path
 * and add all `.js` files to an array.
 *
 * @param {String} absolute path
 */

function iteratePath (p) {
  var self = this
    , files = fs.readdirSync(p);
  files.forEach(function (filename) {
    var file = path.join(p, filename)
      , stat = fs.statSync(file);
    if (stat.isDirectory()) {
      iteratePath(file);
    } else if (stat.isFile()) {
      if (path.extname(file) == '.js')
        appfiles.push(file);
    }
  });
};

// Go!
iteratePath(basepath);

/**
 * Package together all found files into a
 * folio.Glossary, defining a custom "compiler"
 * that will wrap our script with the needed commonjs
 *
 * @param {Array} files
 * @param {Object} folio glossary configuration
 */

console.log('\n  \u001b[90mSUPERCOUCH BROWSER BUILD\u001b[0m');
console.log('  \u001b[90m------------------------\u001b[0m\n');
var applicationJs = new folio.Glossary(appfiles, {
  compilers: {
    js: function (name, source, filename) {
      var title = filename.replace(basepath + '/', '').replace('.js', '')
        , buf = '\nrequire.register("' + title + '", function (module, exports, require) {\n';
      console.log('  \u001b[34mincluding  ::  lib/%s.js\u001b[0m', title);
      buf += source;
      buf += '\n}); // module ' + name;
      return buf;
    }
  }
});

/*!
 * Load up our prefix/suffix
 */

var prefix = fs.readFileSync(join(__dirname, 'browser', 'prefix.js'), 'utf8')
  , suffix = fs.readFileSync(join(__dirname, 'browser', 'suffix.js'), 'utf8')

/**
 * Compile the folio.Glossary, applying our wrapper,
 * and output the src. Wrap with prefix/suffix and
 * write to file.
 */

applicationJs.compile(function (err, src) {
  var content = prefix + src + suffix;
  fs.writeFileSync(join(__dirname, '..', 'supercouch.js'), content, 'utf8');
  console.log('\n  \u001b[32mcompleted  ::  supercouch.js\u001b[0m\n');
});
