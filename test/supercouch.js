if (!chai) {
  var chai = require('chai')
    , supercouch = require('..');
}

var expect = chai.expect;

describe('SuperCouch', function () {
  var couch = supercouch({ url: 'http://local.host:5000/_couchdb' });

  it('should have a version', function () {
    expect(supercouch).to.have.property('version');
  });

  it('should be able to get the CouchDB version', function (done) {
    couch.version(function (err, res) {
      expect(err).to.not.exist;
      expect(res).to.be.a('object');
      expect(res).to.have.property('version');
      done();
    });
  });

});
