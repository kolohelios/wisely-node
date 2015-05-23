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
        User.findByIdAndRemove(request.params.userId, function(err, user){
          if(err){return reply().code(400); }

          return reply(user);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'users.delete'
};
