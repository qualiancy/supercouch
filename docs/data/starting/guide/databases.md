---
  title: Managing Databases
  render-file: false
  weight: 30
---

### Managing Databases

With the `couch` variable you can easily manage creating, updating, deleting and 
invoking actions upon specific databases. All methods (less the `db` modifier will
return an instance of a `Request` that can be `end`ed to make the request. Alternatively,
if you prefer to use SuperCouch in aj less chainable fashion, you may provide a callback
to make the request immediately. The following two examples are equivalant.

##### Chaining

```javascript
couch
  .dbExists('supercouch')
  .end(function (err, res) {
    if (err) throw err; // instanceof supercouch.CouchError
    console.log(res); // true or false
  });
```

##### Callback 

```javascript
couch.dbExists('supercouch', function (err, res) {
  if (err) throw err; // instanceof supercouch.CouchError
  console.log(res); // true or false
});
```

All methods that return an actual `Request` can be used in either manner. See the API 
docs for further information. For consistency, the remainder of this documentation will
be presented using the chaining method.
