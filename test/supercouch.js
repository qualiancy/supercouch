if (!chai) {
  var chai = require('chai')
    , supercouch = require('..');
}

var expect = chai.expect;

describe('SuperCouch', function () {
  var couch = supercouch('http://local.host:5000/_couchdb');

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

  describe('database management', function () {

    it('can create a new db', function (done) {
      couch
        .dbAdd('sc_dbmgmt')
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res).eql({ ok: true });
          done();
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

    it('can check if a db exist', function(done) {
      couch
        .dbExist('sc_dbmgmt')
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res).to.be.true;
          done();
        });
    });

    it('can delete a db', function (done) {
      couch
        .dbDel('sc_dbmgmt')
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res).eql({ ok: true });
          done();
        });
    });

  });

});
