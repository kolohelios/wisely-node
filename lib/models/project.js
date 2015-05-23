/* eslint no-reserved-keys: 0 */

'use strict';

var Mongoose = require('mongoose');
var Project;

var projectSchema = Mongoose.Schema({
  name: {type: String, required: true},
  address: {type: String, required: true},
  isRemodel: {type: Boolean, required: true},
  baseCost: {type: Number},
  isActive: {type: Boolean, default: true, required: true},
  choicesAvailable: {type: Boolean, default: true, required: true},
  createdBy: {type: Mongoose.Schema.ObjectId, ref: 'User', required: true},
  photo: {type: String},
  client: {type: Mongoose.Schema.ObjectId, ref: 'User'},
  projMan: {type: Mongoose.Schema.ObjectId, ref: 'User'},
  createdAt: {type: Date, default: Date.now, required: true},
  rooms: [{
    name: {type: String, required: true},
    floor: {type: String},
    itemCollections: [{
      name: {type: String, required: true},
      costDriver: {type: String},
      numOfUnits: {type: Number},
      items: [{type: String}]
    }]
  }]
});

Project = Mongoose.model('Project', projectSchema);
module.exports = Project;
