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
          password: Joi.string().trim().required()
        }
      },
      description: 'Create a user',
      handler: function(request, reply){
        // make sure that the person doing this is an admin
        // if(user.role === 'admin')
        //

        User.register(request.payload, function(err, user){
          if(err || !user){return reply().code(400); }

          return reply();
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'users.create'
};
