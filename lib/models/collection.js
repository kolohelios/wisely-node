/* eslint no-reserved-keys: 0 */

'use strict';

var Mongoose = require('mongoose');
var Collection;

var collectionSchema = Mongoose.Schema({
      name: {type: String, required: true},
      costDriver: {type: String},
      rooms: [{type: String}],
      createdAt: {type: Date, default: Date.now, required: true},
      items: [{
        name: {type: String},
        extdDesc: {type: String},
        materialPerUnit: {type: Number},
        laborHrsPerUnit: {type: Number},
        photo: {type: String}
      }]
});

Collection = Mongoose.model('Collection', collectionSchema);
module.exports = Collection;
