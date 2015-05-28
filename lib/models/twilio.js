'use strict';

var accountSid = 'ACf86eca60b09fbfbe87f3e82bff7f1b57';
var twilio = require('twilio')(accountSid, process.env.TWILIO_TOKEN);

var twilioWrapper = {
  sendMessage: twilio.messages.create
};

var sendText = function(messageToSend, cb){
  twilioWrapper.sendMessage(messageToSend, function(error, message){
    if(error){return cb(JSON.stringify(error)); }
    return cb(null, message.sid);
  });
};

module.exports = {sendText: sendText, twilioWrapper: twilioWrapper};
