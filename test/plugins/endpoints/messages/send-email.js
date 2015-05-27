/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Server = require('../../../../lib/server');
var Sinon = require('sinon');
var Mandrill = require('../../../../lib/models/mandrill');

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

describe('GET /messages/email', function(){
  before(function(done){
    Server.init(function(err, srvr){
      if(err){ throw err; }
      server = srvr;
      done();
    });
  });


  beforeEach(function(done){
    var db = server.app.environment.MONGO_URL.split('/')[3];
    CP.execFile(Path.join(__dirname, '../../../../scripts/clean-db.sh'), [db], {cwd: Path.join(__dirname, '../../../../scripts')}, function(){
      done();
    });
  });

  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });

  it('should get 200 on successful auth and send message', function(done){
    server.inject({method: 'POST', url: '/messages/email', credentials: {_id: 'b00000000000000000000001'}, payload: {email: 'jkedwards@me.com', password: '1111'}}, function(response){
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should get error from Mandrill', function(done){
    server.inject({method: 'POST', url: '/messages/email', credentials: {_id: 'b00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  it('should return a 401 due to missing credentials', function(done){
    server.inject({method: 'POST', url: '/messages/email'}, function(response){
      expect(response.statusCode).to.equal(401);
      done();
    });
  });

  it('should encounter a db error', function(done){
    var stub = Sinon.stub(Mandrill, 'sendMessage').yields(new Error());
    server.inject({method: 'POST', url: '/messages/email', credentials: {_id: 'b00000000000000000000001'}, payload: {email: 'jkedwards@me.com', password: '1111'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
});
