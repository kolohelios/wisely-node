'use strict';

var Project = require('../../../models/project');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'DELETE',
    path: '/projects/{projectId}/delete',
    config: {
      validate: {
        params: {
          projectId: Joi.string().hex().length(24)
        }
      },
      description: 'Delete a project',
      handler: function(request, reply){
        Project.findByIdAndRemove(request.params.projectId, function(err, project){
          if(err || !project){return reply().code(400); }
          return reply(project);
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'projects.delete'
};
