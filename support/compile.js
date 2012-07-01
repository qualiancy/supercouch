/*!
 * SuperCouch - browser build tool
 * Copyright (c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

var folio = require('folio');

folio('supercouch')
  .root(__dirname, '..')
  .use(folio.reader())
    .file('./lib/supercouch.js')
    .pop()
  .use(folio.indent())
    .line('  ')
    .pop()
  .use(folio.wrapper())
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
  .use(folio.save())
    .file('./supercouch.js')
    .pop()
  .use(folio.minify())
    .pop()
  .use(folio.wrapper())
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
  .use(folio.save())
    .file('./supercouch.min.js')
    .pop()
  .compile();

