'use strict';

var User = require('../../../models/user');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'POST',
    path: '/users/authenticate',
    config: {
      auth: false,
      validate: {
        payload: {
          email: Joi.string().email().lowercase().trim().required(),
          password: Joi.string().trim().required()
        }
      },
      description: 'Authenticate a user',
      handler: function(request, reply){
        User.authenticate(request.payload, function(err, user){
          if(err || !user){return reply().code(400); }

          var token = user.token(server.app.environment);
          return reply({token: token, user: user});
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'users.authenticate'
};
