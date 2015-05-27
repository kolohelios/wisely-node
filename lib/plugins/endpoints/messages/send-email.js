/* eslint camelcase: 0 */

'use strict';

var Mandrill = require('../../../models/mandrill');
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
              to: [{email: request.payload.email, name: 'New User'}],
              from_email: 'jkedwards@me.com',
              subject: 'Thank you',
              text: 'Thank you for creating an account with us. Please log in to the site with your email address and pasword: ' + request.payload.password + ' .'
          }
        };
        Mandrill.sendMessage(messageToSend, function(error, msg){
          console.log('*********************', error, msg);
          if(error){return reply().code(400); }
          console.log(msg);
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
