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

describe('POST /users', function(){
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

  it('should create a new user', function(done){
    server.inject({method: 'POST', url: '/users', credentials: {_id: 'b00000000000000000000001'}, payload: {email: 'jessedwards@me.com', password: '321', contactPref: 'email'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.email).to.equal('jessedwards@me.com');
      expect(response.result.password).to.not.be.ok;
      done();
    });
  });

  it('should not create a new user because of missing contact preference', function(done){
    server.inject({method: 'POST', url: '/users', credentials: {_id: 'b00000000000000000000001'}, payload: {email: 'jessedwards@me.com', password: '321'}}, function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  it('should return a 401 because authenticated user is not an admin', function(done){
    server.inject({method: 'POST', url: '/users', credentials: {_id: 'b00000000000000000000002'}, payload: {email: 'jessedwards@me.com', password: '321', contactPref: 'email'}}, function(response){
      expect(response.statusCode).to.equal(401);
      done();
    });
  });

  it('should return a 400 because authenticated user does not exist', function(done){
    var stub = Sinon.stub(User, 'findById').yields('notauser');
    server.inject({method: 'POST', url: '/users', credentials: {_id: 'b00000000000000000000001'}, payload: {email: 'jessedwards@me.com', password: '321', contactPref: 'email'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });

  it('should result in a 400 error because user exists', function(done){
    server.inject({method: 'POST', url: '/users', credentials: {_id: 'b00000000000000000000001'}, payload: {email: 'jkedwards@me.com', password: '321', contactPref: 'email'}}, function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  it('should encounter a db error in register function', function(done){
    var stub = Sinon.stub(User, 'register').yields(new Error());
    server.inject({method: 'POST', url: '/users', credentials: {_id: 'b00000000000000000000001'}, payload: {email: 'jessedwards@me.com', password: '321', contactPref: 'email'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });

  it('should encounter a db error in isAdmin function', function(done){
    var stub = Sinon.stub(User, 'isAdmin').yields(new Error());
    server.inject({method: 'POST', url: '/users', credentials: {_id: 'b00000000000000000000001'}, payload: {email: 'jessedwards@me.com', password: '321', contactPref: 'email'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
});
