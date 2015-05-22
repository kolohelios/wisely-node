'use strict';

var User = require('../../../models/user');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/users',
    config: {
      description: 'Create a user',
      handler: function(request, reply){
        User.find(function(error, users){
          if(error){return reply().code(400); }
          return reply(users);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'users.index'
};
