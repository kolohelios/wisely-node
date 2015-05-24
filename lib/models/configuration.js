/* eslint no-reserved-keys: 0 */

'use strict';

var Mongoose = require('mongoose');
var Configuration;

var configurationSchema = Mongoose.Schema({
  rooms: [{type: String}],
  roles: [{
    role: {type: String},
    permission: {type: Number}
  }]
});

Configuration = Mongoose.model('Configuration', configurationSchema);
module.exports = Configuration;
