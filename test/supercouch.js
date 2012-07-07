if (!chai) {
  var chai = require('chai')
    , supercouch = require('..');
}

var expect = chai.expect;

describe('SuperCouch', function () {
  var couch
    , database = 'sc_dbmgmt';

  /**
   * Ensure database.
   *
   * @param {String} name
   * @param {Function} callback
   */

  function ensureDb (name, cb) {
    couch
      .dbExists(name)
      .end(function (err, exists) {
        if (exists) return cb();
        couch
          .dbAdd(name)
          .end(function (err, res) {
            cb();
          });
      });
  };

  /**
   * Remove database.
   *
   * @param {String} name
   * @param {Function} callback
   */

  function removeDb (name, cb) {
    couch
      .dbDel(name)
      .end(function (err, res) {
        cb();
      });
  };

  before(function () {
    couch = supercouch('http://local.host:5000/_couchdb');
  });

  beforeEach(function (done) {
    ensureDb(database, done);
  });

  after(function (done) {
    removeDb(database, done);
  });

  it('exposes a version', function () {
    expect(supercouch).to.have.property('version');
  });

  it('can get the CouchDB version', function (done) {
    couch
      .request('get', '/')
      .end(function (err, res) {
        expect(err).to.not.exist;
        expect(res).to.be.a('object');
        expect(res).to.have.property('version');
        done();
      });
  });

  it('can create a new db', function (done) {
    removeDb(database, function() {
      couch
        .dbAdd(database)
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res).eql({ ok: true });
          done();
        });
    });
  });

  it('can get the info for a db', function (done) {
    couch
      .dbInfo(database)
      .end(function (err, res) {
        expect(err).to.not.exist;
        expect(res).to.be.a('object')
          .and.to.have.property('db_name', database);
        done();
      });
  });

  it('can delete a db', function (done) {
    couch
      .dbDel(database)
      .end(function (err, res) {
        expect(err).to.not.exist;
        expect(res).eql({ ok: true });
        done();
      });
  });

  it('can create a new record with id', function (done) {
    couch
      .db(database)
      .insert({ _id: '1', foo: 'bar' })
      .end(function (err, res) {
        expect(err).to.not.exist;
        expect(res.ok).to.be.true;
        done();
      });
  });

  it('can create a new record without and id', function (done) {
    couch
      .db(database)
      .insert({ foo: 'baz' })
      .end(function (err, res) {
        expect(err).to.not.exist;
        expect(res).to.have.property('ok', true);
        done();
      });
  });

  it('can retrive a record', function (done) {
    couch
      .db(database)
      .get('1')
      .end(function (err, res) {
        expect(err).to.not.exist;
        expect(res).to.have.property('foo', 'bar');
        done();
      });
  });

  it('can update a record', function (done) {
    // get the doc (we need the rev)
    couch
      .db(database)
      .get('1')
      .end(function (err, res) {
        expect(err).to.not.exist;
        expect(res).to.have.property('foo', 'bar');
        var rev1 = res._rev;

        couch
          .db(database)
          .update('1', rev1)
          .send({ 'foo': 'boo' })
          .end(function (uerr, ures) {
            expect(uerr).to.not.exist;
            var rev2 = ures.rev;

            couch
              .db(database)
              .get('1')
              .end(function (verr, vres) {
                expect(verr).to.not.exist;
                expect(vres).to.have.property('foo', 'boo');
                expect(vres).to.have.property('_rev', rev2);
                done();
              });
          });
      });
  });

  it('can remove a record', function (done) {
    couch
      .db(database)
      .get('1')
      .end(function (err, res) {
        expect(err, 'GET').to.not.exist;
        var rev1 = res._rev;

        couch
          .db(database)
          .remove('1', rev1)
          .end(function (err, res) {
            expect(err, 'DELETE').to.not.exist;

            couch
              .db(database)
              .get('1', rev1)
              .end(function (err, res) {
                expect(err, 'CONFIRM').to.not.exist;
                done();
              });
          });
      });
  });

  describe('db existance', function() {

    it('can tell if a db exists', function (done) {
      couch
        .dbExists(database)
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res).to.be.true;
          done();
        });
    });

    it('can tell if a db does not exist', function (done) {
      couch
        .dbExists('this-is-unreal')
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res).to.be.false;
          done();
        });
    });

  });

});
