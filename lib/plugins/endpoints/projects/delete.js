'use strict';

var Project = require('../../../models/project');
var User = require('../../../models/user');
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
        User.isProjMan(request.auth.credentials._id, function(err, isProjMan){
          if(err){return reply().code(400); }
          if(isProjMan === false){return reply().code(401); }

          Project.findByIdAndRemove(request.params.projectId, function(error, project){
            if(error || !project){return reply().code(400); }
            return reply(project);
          });
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'projects.delete'
};
