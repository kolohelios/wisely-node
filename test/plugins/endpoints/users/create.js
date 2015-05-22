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

  it('should create a new user', function(done){
    server.inject({method: 'POST', url: '/users', credentials: {_id: 'b00000000000000000000001'}, payload: {email: 'jessedwards@me.com', password: '321'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.email).to.equal('jessedwards@me.com');
      expect(response.result.password).to.not.be.ok;
      done();
    });
  });

  it('should encounter a db error', function(done){
    var stub = Sinon.stub(User, 'register').yields(new Error());
    server.inject({method: 'POST', url: '/users', credentials: {_id: 'b00000000000000000000001'}, payload: {email: 'jessedwards@me.com', password: '321'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
});
