'use strict';

var Collection = require('../../../models/collection');
var User = require('../../../models/user');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'DELETE',
    path: '/collections/{collectionId}/delete',
    config: {
      validate: {
        params: {
          collectionId: Joi.string().hex().length(24)
        }
      },
      description: 'Delete a collection',
      handler: function(request, reply){
        console.log(request.params.collectionId);
        User.isProjMan(request.auth.credentials._id, function(err, isProjMan){
          if(err){return reply().code(400); }
          if(isProjMan === false){return reply().code(401); }

          Collection.findByIdAndRemove(request.params.collectionId, function(error, collection){
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
  name: 'collections.delete'
};
