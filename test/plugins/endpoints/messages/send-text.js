/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Server = require('../../../../lib/server');
var Sinon = require('sinon');
var twilio = require('../../../../lib/models/twilio');

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
    server.inject({method: 'POST', url: '/messages/text', credentials: {_id: 'b00000000000000000000001'}, payload: {number: '3605098185', message: 'test message from lab'}}, function(response){
      expect(response.statusCode).to.equal(200);
      done();
    });
  });
  it('should get a 400 due to error in Twilio', function(done){
    var stub = Sinon.stub(twilio.twilioGrief, 'sendMessage').yields(new Error());
    server.inject({method: 'POST', url: '/messages/text', credentials: {_id: 'b00000000000000000000001'}, payload: {number: '3605098185', message: 'test message from lab'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
});
