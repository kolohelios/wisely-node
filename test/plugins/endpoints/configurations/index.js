/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Server = require('../../../../lib/server');
var Configuration = require('../../../../lib/models/configuration');
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

describe('GET /configurations', function(){
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
  it('should get configuration', function(done){
    server.inject({method: 'GET', url: '/configurations', credentials: {_id: 'b00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(200);
      console.log('*************************************', response.result);
      expect(response.result.length).to.equal(2);
      done();
    });
  });

  it('should return a 401 due to missing credentials', function(done){
    server.inject({method: 'GET', url: '/configurations'}, function(response){
      expect(response.statusCode).to.equal(401);
      done();
    });
  });

  it('should encounter a db error', function(done){
    var stub = Sinon.stub(Configuration, 'find').yields(new Error());
    server.inject({method: 'GET', url: '/configurations', credentials: {_id: 'b00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
});
