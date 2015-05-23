/* eslint no-reserved-keys:0 */
'use strict';

var User = require('../../../models/user');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'DELETE',
    path: '/users/{userId}/delete',
    config: {
      validate: {
        params: {
          userId: Joi.string().hex().length(24)
        }
      },
      description: 'Delete a user',
      handler: function(request, reply){
        User.isAdmin(request.auth.credentials._id, function(err, isAdmin){
          if(err){return reply().code(400); }
          if(isAdmin === false){return reply().code(401); }

          User.findByIdAndRemove(request.params.userId, function(error, user){
            if(error){return reply().code(400); }

            return reply(user);
          });
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'users.delete'
};
