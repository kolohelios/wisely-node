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

describe('DELETE /users/{userId}/delete', function(){
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

  it('should delete a user', function(done){
    server.inject({method: 'DELETE', url: '/users/b00000000000000000000002/delete', credentials: {_id: 'b00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.email).to.equal('test@kolohelios.com');
      done();
    });
  });

  it('should result in a 401 error because no credentials were passed', function(done){
    server.inject({method: 'DELETE', url: '/users/b00000000000000000000002/delete'}, function(response){
      expect(response.statusCode).to.equal(401);
      done();
    });
  });

  it('should encounter a db error in register function', function(done){
    var stub = Sinon.stub(User, 'findByIdAndRemove').yields(new Error());
    server.inject({method: 'DELETE', url: '/users/b00000000000000000000002/delete', credentials: {_id: 'b00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
});
