'use strict';

var Profile = require('../../../models/profile');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/profiles/{profileId?}',
    config: {
      validate: {
        params: {
          profileId: Joi.string().hex().length(24)
        }
      },
      description: 'get a list of profiles or a single profile',
      handler: function(request, reply){
        if(request.params.profileId){
          Profile.findOne({_id: request.params.profileId}, function(err, profile){
            return reply([profile]).code(err ? 400 : 200);
          });
        }else{
          Profile.find(function(err, profiles){
            return reply(profiles).code(err ? 400 : 200);
          });
        }
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'profiles.index'
};
