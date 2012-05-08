if (!chai) {
  var chai = require('chai')
    , supercouch = require('..');
}

var expect = chai.expect;

describe('SuperCouch', function () {
  var couch = supercouch('http://local.host:5000/_couchdb');

  function createDb(name, cb) {
    couch
      .dbExists(name)
      .end(function (err, exists) {
        if (exists) return cb();
        couch.dbAdd(name).end(cb);
      });
  };

  function clean(name, cb) {
    couch.dbDel(name).end(cb);
  };

  // TODO: DB cleanup after tests

  it('has a version', function () {
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
    clean('sc_dbmgmt', function() {
      couch
        .dbAdd('sc_dbmgmt')
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res).eql({ ok: true });
          done();
        });
    });
  });

  it('can get the info for a db', function (done) {
    couch
      .dbInfo('sc_dbmgmt')
      .end(function (err, res) {
        expect(err).to.not.exist;
        expect(res).to.be.a('object')
          .and.to.have.property('db_name', 'sc_dbmgmt');
        done();
      });
  });

  it('can delete a db', function (done) {
    createDb('sc_dbmgmt', function() {
      couch
        .dbDel('sc_dbmgmt')
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res).eql({ ok: true });
          done();
        });
    });
  });

  describe('db existance', function() {

    it('can tell if a db exists', function(done) {
      createDb('sc_dbmgmt', function() {
        couch
          .dbExists('sc_dbmgmt')
          .end(function (err, res) {
            expect(err).to.not.exist;
            expect(res).to.be.true;
            done();
          });
      });
    });

    it('can tell if db does not exist', function(done) {
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
