/* eslint camelcase: 0 */

'use strict';

var mandrill = require('../../../models/mandrill');
// var User = require('../../../models/user');

exports.register = function(server, options, next){
  server.route({
    method: 'POST',
    path: '/messages/email',
    config: {
      description: 'Send a message via email',
      handler: function(request, reply){
        var messageToSend = {
          message: {
              to: [{email: request.payload.email, name: request.payload.name}],
              from_email: 'jkedwards@me.com',
              subject: request.payload.subject,
              text: request.payload.text
          }
        };
        mandrill.sendMessage(messageToSend, function(error){
          if(error){return reply().code(400); }
          return reply();
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'messages.email'
};
