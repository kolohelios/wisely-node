'use strict';

var Project = require('../../../models/project');
var User = require('../../../models/user');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/projects/{projectId}',
    config: {
      description: 'Get a project',
      handler: function(request, reply){
        Project.findById(request.params.projectId, function(err, project){
          if(err || !project){return reply().code(400); }

          User.isAuthorized(project.client, request.auth.credentials._id, function(error, isAuthorized){
            if(error){return reply().code(400); }
            if(isAuthorized === false){return reply().code(401); }

            console.log(project.clientId);


            return reply(project);
          });
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'projects.retrieve'
};
