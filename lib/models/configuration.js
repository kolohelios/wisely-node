/* eslint no-reserved-keys: 0 */

'use strict';

var Mongoose = require('mongoose');
var Configuration;

var configurationSchema = Mongoose.Schema({
  config: [{}]
});

Configuration = Mongoose.model('Configuration', configurationSchema);
module.exports = Configuration;
