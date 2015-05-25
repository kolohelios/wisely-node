/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Server = require('../../../../lib/server');
var Project = require('../../../../lib/models/project');
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

describe('GET /projects/{projectId}', function(){
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

  it('should get one project', function(done){
    server.inject({method: 'GET', url: '/projects/c00000000000000000000001', credentials: {_id: 'b00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.name).to.equal('Edwards remodel');
      done();
    });
  });

  it('should return a 401 due to missing credentials', function(done){
    server.inject({method: 'GET', url: '/projects/c00000000000000000000001'}, function(response){
      expect(response.statusCode).to.equal(401);
      done();
    });
  });

  it('should return a 401 due to this project not belonging to this client', function(done){
    server.inject({method: 'GET', url: '/projects/c00000000000000000000001', credentials: {_id: 'b00000000000000000000003'}}, function(response){
      expect(response.statusCode).to.equal(401);
      done();
    });
  });

  it('should get project because user is a project manager', function(done){
    server.inject({method: 'GET', url: '/projects/c00000000000000000000001', credentials: {_id: 'b00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.name).to.equal('Edwards remodel');
      done();
    });
  });

  it('should return a 400 due to missing record', function(done){
    server.inject({method: 'GET', url: '/projects/notarealrecord', credentials: {_id: 'b00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  it('should encounter a db error in Project', function(done){
    var stub = Sinon.stub(Project, 'findById').yields(new Error());
    server.inject({method: 'GET', url: '/projects/c00000000000000000000001', credentials: {_id: 'b00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });

  it('should encounter a general error in isAuthorized function', function(done){
    var stub = Sinon.stub(User, 'isAuthorized').yields(new Error());
    server.inject({method: 'GET', url: '/projects/c00000000000000000000001', credentials: {_id: 'b00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
  it('should encounter a db error in isAuthorized function', function(done){
    var stub = Sinon.stub(User, 'findById').yields(new Error());
    server.inject({method: 'GET', url: '/projects/c00000000000000000000001', credentials: {_id: 'b00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
  it('should return a 400 because authenticated user does not exist', function(done){
    var stub = Sinon.stub(User, 'findById').yields('c00000000000000000000001', 'notauser');
    server.inject({method: 'GET', url: '/projects/c00000000000000000000001', credentials: {_id: 'b00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
});
