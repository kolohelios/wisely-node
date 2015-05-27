'use strict';

var User = require('../../../models/user');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'POST',
    path: '/users',
    config: {
      validate: {
        payload: {
          email: Joi.string().email().lowercase().trim().required(),
          password: Joi.string().trim().required(),
          firstName: Joi.string(),
          lastName: Joi.string(),
          phone: Joi.string(),
          role: Joi.number().min(0).max(255)
        }
      },
      description: 'Create a user',
      handler: function(request, reply){
        User.isAdmin(request.auth.credentials._id, function(err, isAdmin){
          if(err){return reply().code(400); }
          if(isAdmin === false){return reply().code(401); }

          User.register(request.payload, function(error, validUser){
            if(error || !validUser){return reply().code(400); }

            validUser.password = null;
            return reply(validUser);
          });
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'users.create'
};
