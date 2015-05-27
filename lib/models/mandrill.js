'use strict';

var Mandrill = require('node-mandrill')(process.env.MANDRILL_API_KEY);

function sendMessage(messageToSend, cb){
  Mandrill('/messages/send', messageToSend, function(error, response){
    if(error){
      return cb(JSON.stringify(error));
    }
    return cb(null, response);
  });
}

module.exports = {sendMessage: sendMessage};
