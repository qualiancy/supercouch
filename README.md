# SuperCouch

> A super duper CouchDB driver for node and the browser.


## Tests

Tests are written in the BDD styles for the [Mocha](http://visionmedia.github.com/mocha) test runner using the
`expect` assertion interface from [Chai](http://chaijs.com). Running tests is simple:

First, make sure that you have the following forward set up in your `/etc/hosts`

    127.0.0.1  local.host

Then start the test server. This will allow you test both the server and browser versions simultaneously.

    make test-server

To run the server side tests:

    make test

To run the browser side tests, first make the most recent version:

    make 

Then point your browser to [http://local.host:5000/test/browser/](http://local.host:5000/test/browser/].

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
