/* eslint camelcase: 0 */

'use strict';

var twilio = require('../../../models/twilio');
var Joi = require('joi');
// var User = require('../../../models/user');

exports.register = function(server, options, next){
  server.route({
    method: 'POST',
    path: '/messages/text',
    config: {
      validate: {
        payload: {
          number: Joi.string().length(10),
          message: Joi.string()
        }
      },
      description: 'Send a message via email',
      handler: function(request, reply){
        var messageToSend = {
              to: request.payload.number,
              from: '+19292947359',
              body: request.payload.message
        };
        twilio.sendText(messageToSend, function(error, message){
          if(error){return reply().code(400); }
          return reply(null, message);
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'messages.text'
};
