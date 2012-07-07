---
  title: Managing Documents
  render-file: false
  weight: 40
---

### Managing Documents

For managing documents, all you have to do is select the database for which you wish
to work with. 

```javascript
couch
  .db('supercouch')
  .insert({ _id: 'abc', foo: 'bar' })
  .end(function (err, res) {
    if (err) throw err; // instanceof supercouch.CouchError
    console.log(res.ok); // true if successful
  });
```

The `_id` option is optional. SuperCouch will transparently handle the appropriate
request methodology to ensure your insert sticks. You may also store a reference to
a specific database if you are performing multiple actions:

```javascript
var scdb = couch.db('supercouch');

scdb
  .insert({ foo: 'bar' })
  .end(cb);

scdb
  .insert({ foo: 'baz' })
  .end(cb);
```

There are a number a variations for each method. Consult to the API documentation below
to find a suitable style.
