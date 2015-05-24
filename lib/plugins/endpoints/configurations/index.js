'use strict';

var Configuration = require('../../../models/configuration');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/configurations',
    config: {
      description: 'Get configuration information',
      handler: function(request, reply){
        Configuration.find(function(err, configuration){
          if(err || !configuration){return reply().code(400); }
          return reply(configuration);
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'configurations.index'
};
