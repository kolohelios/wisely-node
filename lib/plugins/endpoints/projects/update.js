/* eslint no-reserved-keys:0 */
'use strict';

var Project = require('../../../models/project');
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
          isRemodel: Joi.boolean(),
          baseCost: Joi.number()
        }
      },
      description: 'Update a project',
      handler: function(request, reply){
        Project.findByIdAndUpdate(request.params.projectId, request.payload, {new: true}, function(err, project){
          if(err || !project){return reply().code(400); }
          return reply(project);
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'projects.update'
};
