/* eslint no-reserved-keys:0 */
'use strict';

var Collection = require('../../../models/collection');
var User = require('../../../models/user');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'PUT',
    path: '/collections/{collectionId}/update',
    config: {
      validate: {
        payload: {
          name: Joi.string().required(),
          costDriver: Joi.string(),
          rooms: Joi.array(),
          items: Joi.array()
        },
        params: {
          collectionId: Joi.string().hex().length(24)
        }
      },
      description: 'Update a collection',
      handler: function(request, reply){
        User.isProjMan(request.auth.credentials._id, function(err, isProjMan){
          if(err){return reply().code(400); }
          if(isProjMan === false){return reply().code(401); }

          Collection.findByIdAndUpdate(request.params.collectionId, request.payload, {new: true}, function(error, collection){
            if(error || !collection){return reply().code(400); }
            return reply(collection);
          });
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'collections.update'
};
