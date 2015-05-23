'use strict';

var Project = require('../../../models/project');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/projects',
    config: {
      description: 'Get an index of projects',
      handler: function(request, reply){
        Project.find(function(err, projects){
          if(err || !projects){return reply().code(400); }
          return reply(projects);
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'projects.index'
};
