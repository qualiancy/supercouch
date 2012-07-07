---
  title: Connecting to CouchDB
  render-file: false
  weight: 20
---

### Connecting to CouchDB

The first level of SuperCouch's chainable API is the making a connection 
to CouchDB. This can be done by simply invoking the primary export with
the URL of your CouchDB installation:

```javascript
var supercouch = require('supercouch')
  , couch = supercouch('http://localhost:5984');
```

Now, all requests using the `couch` variable will be directed to that URL.,

