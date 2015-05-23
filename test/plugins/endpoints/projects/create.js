/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Server = require('../../../../lib/server');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var after = lab.after;
var CP = require('child_process');
var Path = require('path');
var beforeEach = lab.beforeEach;

var server;

describe('POST /projects', function(){
  before(function(done){
    Server.init(function(err, srvr){
      if(err){ throw err; }
      server = srvr;
      done();
    });
  });

  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });

  beforeEach(function(done){
    var db = server.app.environment.MONGO_URL.split('/')[3];
    CP.execFile(Path.join(__dirname, '../../../../scripts/clean-db.sh'), [db], {cwd: Path.join(__dirname, '../../../../scripts')}, function(){
      done();
    });
  });

  it('should create a new project', function(done){
    server.inject({method: 'POST', url: '/projects', credentials: {_id: 'b00000000000000000000001'},
    payload: {name: 'Edwards remodel',
    address: '4797 Twilight Place\nBlaine, WA 98230',
    isRemodel: true,
    baseCost: 18000}},
    function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.name).to.equal('Edwards remodel');
      expect(response.result.address).to.equal('4797 Twilight Place\nBlaine, WA 98230');
      expect(response.result.isRemodel).to.equal(true);
      expect(response.result.isActive).to.equal(true);
      expect(response.result.choicesAvailable).to.equal(true);
      expect(response.result.baseCost).to.equal(18000);
      expect(response.result.client).to.be.an('undefined');
      expect(response.result.progMan).to.be.an('undefined');
      expect(response.result.rooms).to.have.length(0);
      expect(response.result.createdAt).to.be.within(Date.now() - 10000, Date.now() + 10000);
      expect(response.result.createdAt).to.be.within(Date.now() - 10000, Date.now() + 10000);
      expect(response.result.createdBy.toString()).to.equal('b00000000000000000000001');
      done();
    });
  });

  it('should return a 401 due to missing credentials', function(done){
    server.inject({method: 'POST', url: '/projects',
    payload: {name: 'Edwards remodel',
    address: '4797 Twilight Place\nBlaine, WA 98230',
    isRemodel: true,
    baseCost: 18000}},
    function(response){
      expect(response.statusCode).to.equal(401);
      done();
    });
  });

  it('should return a 400 due to missing a required payload attribute', function(done){
    server.inject({method: 'POST', url: '/projects', credentials: {_id: 'b00000000000000000000001'},
    payload: {address: '4797 Twilight Place\nBlaine, WA 98230',
    isRemodel: true,
    baseCost: 18000}},
    function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
});
