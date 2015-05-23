/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Server = require('../../../../lib/server');
var Collection = require('../../../../lib/models/collection');
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

describe('UPDATE /collections/{collectionId}/update', function(){
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

  it('should update a collection', function(done){
    server.inject({method: 'PUT', url: '/collections/f00000000000000000000001/update',
    payload: {name: 'deck surfaces'},
    credentials: {_id: 'b00000000000000000000001'}},
    function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.name).to.equal('deck surfaces');
      done();
    });
  });

  it('should return a 401 because authenticated user is not a project manager', function(done){
    server.inject({method: 'PUT', url: '/collections/f00000000000000000000001/update',
    payload: {name: 'deck surfaces'},
    credentials: {_id: 'b00000000000000000000002'}},
    function(response){
      expect(response.statusCode).to.equal(401);
      done();
    });
  });

  it('should return a 401 due to missing credentials', function(done){
    server.inject({method: 'PUT', url: '/projects/f00000000000000000000001/update',
    payload: {name: 'deck surfaces'}},
    function(response){
      expect(response.statusCode).to.equal(401);
      done();
    });
  });

  it('should return a 400 due to missing parameter', function(done){
    server.inject({method: 'PUT', url: '/collections/f00000000000000000000001/update',
    credentials: {_id: 'b00000000000000000000001'}},
    function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  it('should encounter a db error', function(done){
    var stub = Sinon.stub(Collection, 'findByIdAndUpdate').yields(new Error());
    server.inject({method: 'PUT', url: '/collections/f00000000000000000000001/update',
    payload: {name: 'deck surfaces'},
    credentials: {_id: 'b00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
  it('should encounter a db error in isProjMan', function(done){
    var stub = Sinon.stub(User, 'isProjMan').yields(new Error());
    server.inject({method: 'PUT', url: '/collections/f00000000000000000000001/update',
    payload: {name: 'deck surfaces'},
    credentials: {_id: 'b00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
});
