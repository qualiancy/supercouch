if (!chai) {
  var chai = require('chai')
    , supercouch = require('..');
}

/**
 * Support
 *
 * @type {Function}
 */
var expect = chai.expect;

/**
 * Test database
 *
 * @type {String}
 */
var database = 'sc_dbmgmt';

/**
 * Ensure database.
 *
 * @param {String} name
 * @param {Function} callback
 */
function ensureDb(name, cb) {
  couch
    .dbExists(name)
    .end(function (err, exists) {
      if (exists) return cb();
      couch.dbAdd(name).end(cb);
    });
};

/**
 * Remove database.
 *
 * @param {String} name
 * @param {Function} callback
 */
function removeDb(name, cb) {
  couch.dbDel(name).end(cb);
};

// TODO: Add custom Chai.js matchers.
//
// Idea:
//
//    expect(record).to.be.deleted.from(db);
//    expect(record).to.exist.in(db);

/**
 * Subject
 *
 * @type {Supercouch}
 */
var couch = supercouch('http://local.host:5000/_couchdb');

describe('SuperCouch', function () {

  beforeEach(function(done) {
    ensureDb(database, done);
  });

  // TODO: DB cleanup after tests

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

  it('can create a new record', function(done) {
    couch
      .db(database)
      .insert({ _id: '1', foo: 'bar' })
      .end(function (err, res) {
        expect(err).to.not.exist;
        expect(res.ok).to.be.true;
        done();
      });
  });

  it('can retrive a record', function(done) {
    // TODO: Ensure the record
    couch
      .db(database)
      .get('1')
      .end(function (err, res) {
        expect(err).to.not.exist;
        done();
      });
  });

  describe('db existance', function() {

    it('can tell if a db exists', function(done) {
      couch
        .dbExists(database)
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res).to.be.true;
          done();
        });
    });

    it('can tell if a db does not exist', function(done) {
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
