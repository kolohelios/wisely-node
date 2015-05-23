/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Server = require('../../../../lib/server');
var User = require('../../../../lib/models/user');
var Sinon = require('sinon');

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

describe('POST /collections', function(){
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

  it('should create a new collection', function(done){
    server.inject({method: 'POST', url: '/collections', credentials: {_id: 'b00000000000000000000001'},
    payload: {name: 'floor coverings',
    costDriver: 'square foot',
    rooms: ['living room', 'bedroom']}},
    function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.name).to.equal('floor coverings');
      expect(response.result.costDriver).to.equal('square foot');
      expect(response.result.rooms[0]).to.equal('living room');
      expect(response.result.createdAt).to.be.within(Date.now() - 10000, Date.now() + 10000);
      done();
    });
  });
  it('should not create a new collection because authenticated user is not a project manager', function(done){
    server.inject({method: 'POST', url: '/collections', credentials: {_id: 'b00000000000000000000002'},
    payload: {name: 'floor coverings',
    costDriver: 'square foot',
    rooms: ['living room', 'bedroom']}},
    function(response){
      expect(response.statusCode).to.equal(401);
      done();
    });
  });

  it('should encounter a db error in isProjMan function', function(done){
    var stub = Sinon.stub(User, 'isProjMan').yields(new Error());
    server.inject({method: 'POST', url: '/collections', credentials: {_id: 'b00000000000000000000001'},
    payload: {name: 'floor coverings',
    costDriver: 'square foot',
    rooms: ['living room', 'bedroom']}},
    function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
});
