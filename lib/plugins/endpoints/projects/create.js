'use strict';

var Project = require('../../../models/project');
var User = require('../../../models/user');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'POST',
    path: '/projects',
    config: {
      validate: {
        payload: {
          name: Joi.string().required(),
          address: Joi.string().required(),
          isRemodel: Joi.boolean(),
          baseCost: Joi.number()
        }
      },
      description: 'Create a project',
      handler: function(request, reply){
        User.isProjMan(request.auth.credentials._id, function(err, isProjMan){
          if(err){return reply().code(400); }
          if(isProjMan === false){return reply().code(401); }

          var project = new Project(request.payload);
          project.createdBy = request.auth.credentials._id;
          project.save();
          return reply(project);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'projects.create'
};
