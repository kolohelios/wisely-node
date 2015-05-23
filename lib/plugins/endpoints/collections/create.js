'use strict';

var Collection = require('../../../models/collection');
var User = require('../../../models/user');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'POST',
    path: '/collections',
    config: {
      validate: {
        payload: {
          name: Joi.string().required(),
          costDriver: Joi.string(),
          rooms: Joi.array()
        }
      },
      description: 'Create a collection',
      handler: function(request, reply){
        User.isProjMan(request.auth.credentials._id, function(err, isProjMan){
          if(err){return reply().code(400); }
          if(isProjMan === false){return reply().code(401); }

          var collection = new Collection(request.payload);
          collection.createdBy = request.auth.credentials._id;
          collection.save();
          return reply(collection);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'collections.create'
};
