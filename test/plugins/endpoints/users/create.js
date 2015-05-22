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
    server.inject({method: 'POST', url: '/users', credentials: {_id: 'b00000000000000000000001'}, payload: {email: 'andrew@test.com', password: '321'}},function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.email).to.equal('andrew@test.com');
      expect(response.result.password).to.not.be.ok;
      done();
    });
  });

  it('should create a new user', function(done){
    server.inject({method: 'POST', url: '/users', credentials: {_id: 'b00000000000000000000001'}, payload: {email: '33andrew@test.com', password: '321'}}, function(response){
      expect(response.statusCode).to.equal(200);
      done();
    });
  });
});
