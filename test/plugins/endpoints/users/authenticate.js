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

describe('POST /users/authenticate', function(){
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
  it('should pass authentication with valid credentials', function(done){
    server.inject({method: 'POST', url: '/users/authenticate', credentials: {_id: 'b00000000000000000000002'}, payload: {email: 'test@kolohelios.com', password: 'aaa'}}, function(response){
      expect(response.statusCode).to.equal(200);
      done();
    });
  });
  it('should return an error 400 on User.authenticate', function(done){
    var stub = Sinon.stub(User, 'authenticate').yields(new Error());
    server.inject({method: 'POST', url: '/users/authenticate', credentials: {_id: 'b00000000000000000000001'}, payload: {email: 'bbb@bbb.com', password: 'bbb'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
  it('should return an error 400 on User.authenticate because there is no user', function(done){
    server.inject({method: 'POST', url: '/users/authenticate', credentials: {_id: 'b00000000000000000000001'}, payload: {email: '33andrew@test.com', password: '321'}}, function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
  it('should return an error 400 on bcrypt comparison failure', function(done){
    server.inject({method: 'POST', url: '/users/authenticate', credentials: {_id: 'b00000000000000000000002'}, payload: {email: 'test@kolohelios.com', password: '123'}}, function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
});
