'use strict';

var Collection = require('../../../models/collection');
var User = require('../../../models/user');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/collections',
    config: {
      description: 'Get collections',
      handler: function(request, reply){
        User.isProjMan(request.auth.credentials._id, function(err, isProjMan){
          if(err){return reply().code(400); }
          if(isProjMan === false){return reply().code(401); }

          Collection.find(function(error, collections){
            if(error){return reply().code(400); }

            return reply(collections);
          });
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'collections.index'
};
