'use strict';

var accountSid = 'ACf86eca60b09fbfbe87f3e82bff7f1b57';
var twilio = require('twilio')(accountSid, process.env.TWILIO_TOKEN);

function sendText(messageToSend, cb){
  twilio.messages.create(messageToSend, function(error, message){
    if(error){return cb(JSON.stringify(error)); }
    return cb(null, message.sid);
  });
}

module.exports = {sendText: sendText};
