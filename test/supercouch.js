if (!chai) {
  var chai = require('chai')
    , supercouch = require('..');
}

var expect = chai.expect;

describe('SuperCouch', function () {
  var couch = supercouch('http://local.host:5000/_couchdb');

  it('should have a version', function () {
    expect(supercouch).to.have.property('version');
  });

  it('should be able to get the CouchDB version', function (done) {
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

    it('should be able to create a new db', function (done) {
      couch
        .dbAdd('sc_dbmgmt')
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res).eql({ ok: true });
          done();
        });
    });

    it('should be able to get the info for a db', function (done) {
      couch
        .dbInfo('sc_dbmgmt')
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res).to.be.a('object')
            .and.to.have.property('db_name', 'sc_dbmgmt');
          done();
        });
    });

    it('should be able to delete a db', function (done) {
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
