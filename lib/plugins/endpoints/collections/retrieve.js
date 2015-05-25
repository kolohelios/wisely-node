'use strict';

var Collection = require('../../../models/collection');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/collections/{collectionId}',
    config: {
      description: 'Get a single collection',
      handler: function(request, reply){
        Collection.findById(request.params.collectionId, function(err, collection){
          if(err || !collection){return reply().code(400); }
          return reply(collection);
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'collections.retrieve'
};
