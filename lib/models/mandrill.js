'use strict';

var mandrill = require('mandrill-api');
var mandrillClient = new mandrill.Mandrill(process.env.MANDRILL_API_KEY);

function sendMessage(messageToSend, cb){
  mandrillClient.messages.send(messageToSend, function(response){
    return cb(null, response);
  }, function(error){
    return cb(JSON.stringify(error));
  });
}

module.exports = {sendMessage: sendMessage};
