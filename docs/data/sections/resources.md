---
  title: Resources
  render-file: false
  weight: 10
---

## Resources

### Tests

Tests are written in the BDD styles for the [Mocha](http://visionmedia.github.com/mocha) test runner using the
`expect` assertion interface from [Chai](http://chaijs.com). Running tests is simple:

#### Preperation

You will need to start the test server. This will allow you test both the server and browser versions simultaneously.
You will also need a CouchDB server running locally using the default configuration.

    make test-server

##### Server Tests

To run the server side tests:

    make test

##### Browser Tests

To run the browser side tests, first make the most recent version of the browser build.

    make 

Then point your browser to [http://localhost:5000/test/browser/](http://localhost:5000/test/browser/).

### License

(The MIT License)
