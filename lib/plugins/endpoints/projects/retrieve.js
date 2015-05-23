'use strict';

var Project = require('../../../models/project');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/projects/{projectId}',
    config: {
      description: 'Get an index of projects',
      handler: function(request, reply){
        Project.findById(request.params.projectId, function(err, project){
          if(err || !project){return reply().code(400); }
          return reply(project);
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'projects.retrieve'
};
