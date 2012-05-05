var chai = require('chai')
  , chaiHttp = require('chai-http')
  , expect = chai.expect;

chai.use(chaiHttp);

var supercouch = require('..');

describe('SuperCouch', function () {
  var couch = supercouch();

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
