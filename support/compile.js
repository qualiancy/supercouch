/*!
 * SuperCouch - browser build tool
 * Copyright (c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

var folio = require('folio');

folio('supercouch')
  .root(__dirname, '..')
  .use('reader')
    .file('./lib/supercouch.js')
    .pop()
  .use('indent')
    .line('  ')
    .pop()
  .use('wrapper')
    .prefix(
      [ 'var supercouch = function (req) {'
      , '  var module = {};\n'
      ].join('\n')
    )
    .suffix(
      [ '\n  return module.exports(req);'
      , '}(superagent);'
      ].join('\n')
    )
    .pop()
  .use('save')
    .file('./supercouch.js')
    .pop()
  .use('minify')
    .pop()
  .use('wrapper')
    .prefix(
      [ '/*!'
      , ' * SuperCouch'
      , ' * Copyright (c) 2012 Jake Luer <jake@qualiancy.com>'
      , ' * MIT Licensed'
      , ' *'
      , ' * @website http://supercou.ch'
      , ' * @issues https://github.com/qualiancy/supercouch/issues'
      , ' */\n'
      ].join('\n')
    )
    .pop()
  .use('save')
    .file('./supercouch.min.js')
    .pop()
  .compile();
