'use strict';

var Profile = require('../../../models/profile');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'POST',
    path: '/profiles',
    config: {
      validate: {
        payload: {
          firstName: Joi.string().min(2).required(),
          lastName: Joi.string().min(2).required(),
          photo: Joi.string(),
          skills: Joi.array().required(),
          exposure: Joi.array().required(),
          bio: Joi.string().required(),
          location: Joi.string().required(),
          interests: Joi.array().required(),
          remote: Joi.boolean().required(),
          relocate: Joi.boolean().required(),
          locationPref: Joi.array().required(),
          education: Joi.string(),
          contact: Joi.object().keys({
            email: Joi.string(),
            phone: Joi.string(),
            address: Joi.string()
          }),
          social: Joi.object().keys({
            github: Joi.string(),
            facebook: Joi.string(),
            twitter: Joi.string(),
            linkedIn: Joi.string(),
            stackoverflow: Joi.string()
          })
        }
      },
      description: 'Create a profile',
      handler: function(request, reply){
        var profile = new Profile(request.payload);
        profile.save(function(){
          return reply(profile);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'profiles.create'
};
