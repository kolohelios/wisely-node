'use strict';

var accountSid = 'APaef87e4c66d18fd34fb00f47804aa039';
var twilio = require('twilio')(accountSid, process.env.TWILIO_TOKEN);

function sendText(messageToSend, cb){
  twilio.messages.create(messageToSend, function(response){
    return cb(null, response);
  }, function(error){
    return cb(JSON.stringify(error));
  });
}

module.exports = {sendText: sendText};
