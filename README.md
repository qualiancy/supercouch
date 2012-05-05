# SuperCouch

> A super duper CouchDB driver for node and the browser.

## Installation

This module is not yet available for installation.

## Getting Started

```js
# node.js
var supercouch = require('supercouch')
  , couch = supercouch('http://localhost:5984');

# browser
var couch = supercouch('http://localhost:5984');

# basic request (check connection)
couch.version(function (err, res) {
  console.log(res.version);
});
```

## Expected API

This is tentative, but I like the chainable API :)

### Creating DB

```js
couch
  .createDb('appusers')
  .end(function (err) {
    // ...
  });
```

### Setting a Document

Here is a basic creation request.

```js
couch
  .db('appUsers')
  .insert({ 
      name: 'Arthur Dent'
    , occupation: 'traveller'
  })
  .end(function (err, doc) {
    var id = doc.id
      , rev = doc.rev
    // ...
  });
```

Here is how you would modify that user.
```js
couch
  .db('appUsers')
  .update(id, {
      name: 'Arthur Dent'
    , occupation: 'universe traveller' 
  })
  .end(function (err, doc) {
    var id = doc.id
      , rev = doc.rev
    // ...
  });
```

If you want to modify based on a revision.

```js
couch
  .db('appUsers')
  .update(id, rev, {
      name: 'Arthur Dent'
    , occupation: 'universe traveller' 
  })
  .end(function (err, doc) {
    var id = doc.id
      , rev = doc.rev
    // ...
  });
```

Alternatively, you can also include the revs in the object.

```js
couch
  .db('appUsers')
  .update({
      _id: id
    , _rev: rev
    , name: 'Arthur Dent'
    , occupation: 'universe traveller' 
  })
  .end(function (err, doc) {
    var id = doc.id
      , rev = doc.rev
    // ...
  });
```

### Getting a Document

To get the user based on the id, the following request would be issued.

```js
couch
  .db('appUsers')
  .get(id)
  .end(function (err, doc) {
    // ...
  });
```

You can also get the user based on a revision.

```js
couch
  .db('appUsers')
  .get(id, rev)
  .end(function (err, doc) {
    // ...
  });
```

## Tests

Tests are written in the BDD styles for the [Mocha](http://visionmedia.github.com/mocha) test runner using the
`expect` assertion interface from [Chai](http://chaijs.com). Running tests is simple:

#### Preperation

First, make sure that you have the following forward set up in your `/etc/hosts`

    127.0.0.1  local.host

Then start the test server. This will allow you test both the server and browser versions simultaneously.

    make test-server

#### Server Tests

To run the server side tests:

    make test

#### Browser Tests

To run the browser side tests, first make the most recent version:

    make 

Then point your browser to [http://local.host:5000/test/browser/](http://local.host:5000/test/browser/).

## License

(The MIT License)

Copyright (c) 2012 Jake Luer <jake@qualiancy.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
