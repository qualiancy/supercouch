var Request = require('../request');

module.exports = Request.extend({

    insert: function (obj) {

    }

  , update: function (id, rev, obj) {

    }

  , get: function (id, rev) {
      this.method = 'GET';
      this.path.push(id);
      if (rev) this.qs.rev = rev;
      return this;
    }

  , set: function (id, rev) {
      // not sure if we can do this or not.
    }
});
