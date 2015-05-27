/* eslint camelcase: 0 */

'use strict';

var twilio = require('../../../models/twilio');
// var User = require('../../../models/user');

exports.register = function(server, options, next){
  server.route({
    method: 'POST',
    path: '/messages/text',
    config: {
      description: 'Send a message via email',
      handler: function(request, reply){
        var messageToSend = {
          message: {
              to: '3605098185',
              from: 'jkedwards@me.com',
              subject: 'Thank you',
              text: 'Hello.'
          }
        };
        twilio.sendText(messageToSend, function(error){
          if(error){return reply().code(400); }
          return reply();
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'messages.text'
};
