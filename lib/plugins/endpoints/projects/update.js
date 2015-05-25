/* eslint no-reserved-keys:0 */
'use strict';

var Project = require('../../../models/project');
var User = require('../../../models/user');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'PUT',
    path: '/projects/{projectId}/update',
    config: {
      validate: {
        payload: {
          name: Joi.string().required(),
          address: Joi.string().required(),
          photo: Joi.object(),
          isRemodel: Joi.boolean(),
          baseCost: Joi.number(),
          rooms: Joi.array(),
          client: Joi.object(),
          projMan: Joi.object(),
          choicesAvailable: Joi.boolean(),
          isActive: Joi.boolean()
        }
      },
      description: 'Update a project',
      handler: function(request, reply){
        User.isProjMan(request.auth.credentials._id, function(err, isProjMan){
          if(err){return reply().code(400); }
          if(isProjMan === false){return reply().code(401); }

          Project.findByIdAndUpdate(request.params.projectId, request.payload, {new: true}, function(error, project){
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
  name: 'projects.update'
};
