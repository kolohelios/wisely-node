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

describe('UPDATE /projects/{projectId}/update', function(){
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

  it('should update a project', function(done){
    server.inject({method: 'PUT', url: '/projects/c00000000000000000000001/update', payload: {name: 'Wyle remodel',
    address: '5000 Twilight Place\nBlaine, WA 98230',
    isRemodel: true},
    credentials: {_id: 'b00000000000000000000001'}},
    function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.name).to.equal('Wyle remodel');
      done();
    });
  });

  it('should return a 401 because authenticated user is not a project manager', function(done){
    server.inject({method: 'PUT', url: '/projects/c00000000000000000000001/update', payload: {name: 'Wyle remodel',
    address: '5000 Twilight Place\nBlaine, WA 98230',
    isRemodel: true},
    credentials: {_id: 'b00000000000000000000002'}},
    function(response){
      expect(response.statusCode).to.equal(401);
      done();
    });
  });

  it('should return a 401 due to missing credentials', function(done){
    server.inject({method: 'PUT', url: '/projects/c00000000000000000000001/update', payload: {name: 'Wyle remodel',
    address: '5000 Twilight Place\nBlaine, WA 98230',
    isRemodel: true}},
    function(response){
      expect(response.statusCode).to.equal(401);
      done();
    });
  });

  it('should return a 400 due to missing parameter', function(done){
    server.inject({method: 'PUT', url: '/projects/c00000000000000000000001/update', payload: {name: 'Wyle remodel',
    isRemodel: true},
    credentials: {_id: 'b00000000000000000000001'}},
    function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  it('should encounter a db error', function(done){
    var stub = Sinon.stub(Project, 'findByIdAndUpdate').yields(new Error());
    server.inject({method: 'PUT', url: '/projects/c00000000000000000000001/update', payload: {name: 'Wyle remodel',
    address: '5000 Twilight Place\nBlaine, WA 98230',
    isRemodel: true},
    credentials: {_id: 'b00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
  it('should encounter a db error in isProjMan', function(done){
    var stub = Sinon.stub(User, 'isProjMan').yields(new Error());
    server.inject({method: 'PUT', url: '/projects/c00000000000000000000001/update', payload: {name: 'Wyle remodel',
    address: '5000 Twilight Place\nBlaine, WA 98230',
    isRemodel: true},
    credentials: {_id: 'b00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
});
