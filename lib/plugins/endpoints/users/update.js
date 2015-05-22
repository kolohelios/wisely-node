/* eslint no-reserved-keys:0 */
'use strict';

var User = require('../../../models/user');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'PUT',
    path: '/users',
    config: {
      validate: {
        payload: {
          email: Joi.string().email().lowercase().trim(),
          password: Joi.string().trim(),
          createdAt: Joi.date(),
          firstName: Joi.string(),
          lastName: Joi.string(),
          company: Joi.string()
        }
      },
      description: 'Update changes to a user',
      handler: function(request, reply){
        User.findByIdAndUpdate(request.auth.credentials._id, request.payload, {new: true}, function(err, user){
          if(err){return reply().code(400); }

          user.password = null;
          return reply(user);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'users.update'
};
