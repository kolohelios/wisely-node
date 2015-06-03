/* eslint no-reserved-keys:0 */
'use strict';

var User = require('../../../models/user');
var Joi = require('joi');
var Bcrypt = require('bcrypt');

exports.register = function(server, options, next){
  server.route({
    method: 'PUT',
    path: '/users/{userId}/update',
    config: {
      validate: {
        payload: {
          email: Joi.string().email().lowercase().trim(),
          password: Joi.string().trim(),
          createdAt: Joi.date(),
          firstName: Joi.string(),
          lastName: Joi.string(),
          phone: Joi.string(),
          role: Joi.number().min(0).max(255),
          contactPref: Joi.string(),
          company: Joi.string()
        }
      },
      description: 'Update changes to a user',
      handler: function(request, reply){
        User.isAdmin(request.auth.credentials._id, function(err, isAdmin){
          if(err){return reply().code(400); }
          if(isAdmin === false){return reply().code(401); }

          if(request.payload.password){
            request.payload.password = Bcrypt.hashSync(request.payload.password, 8);
          }

          User.findByIdAndUpdate(request.params.userId, request.payload, {new: true}, function(error, user){
            if(!user || error){return reply().code(400); }

            user.password = null;
            return reply(user);
          });
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'users.update'
};
