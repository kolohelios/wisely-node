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

describe('PUT /users/{userId}/update', function(){
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

  it('should update a user', function(done){
    server.inject({method: 'PUT', url: '/users/b00000000000000000000001/update', credentials: {_id: 'b00000000000000000000001'}, payload: {email: 'jessica@me.com'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.email).to.equal('jessica@me.com');
      expect(response.result.password).to.not.be.ok;
      done();
    });
  });
  it('should return a 401 because authenticated user is not an admin', function(done){
    server.inject({method: 'PUT', url: '/users/b00000000000000000000002/update', credentials: {_id: 'b00000000000000000000002'}, payload: {email: 'jessedwards@me.com'}}, function(response){
      expect(response.statusCode).to.equal(401);
      done();
    });
  });

  it('should return a 400 because user to update was not found', function(done){
    server.inject({method: 'PUT', url: '/users/nouserhere/update', credentials: {_id: 'b00000000000000000000001'}, payload: {email: 'jessica@me.com'}}, function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
  it('should return a 401 because no credentials were sent', function(done){
    server.inject({method: 'PUT', url: '/users/b00000000000000000000001/update', payload: {email: 'jessica@me.com'}}, function(response){
      expect(response.statusCode).to.equal(401);
      done();
    });
  });
  it('should encounter a db error', function(done){
    var stub = Sinon.stub(User, 'findByIdAndUpdate').yields(new Error());
    server.inject({method: 'PUT', url: '/users/b00000000000000000000001/update', credentials: {_id: 'b00000000000000000000001'}, payload: {email: 'jessedwards@me.com'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });

  it('should encounter a db error in isAdmin function', function(done){
    var stub = Sinon.stub(User, 'isAdmin').yields(new Error());
    server.inject({method: 'PUT', url: '/users/b00000000000000000000002/update', credentials: {_id: 'b00000000000000000000001'}, payload: {email: 'jessedwards@me.com'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
});
