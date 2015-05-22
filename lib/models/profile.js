/* eslint no-reserved-keys: 0 */

'use strict';

var Mongoose = require('mongoose');
var Profile;

var profileSchema = Mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  photo: {type: String, required: true},
  createdAt: {type: Date, required: true, default: Date.now},
  skills: [{type: String, required: true}],
  exposure: [{type: String, required: true}],
  bio: {type: String, required: true},
  location: {type: String, required: true},
  interests: [{type: String, required: true}],
  remote: {type: Boolean, required: true, default: true},
  relocate: {type: Boolean, required: true, default: false},
  locationPref: [{type: String, required: true}],
  education: [{type: String}],
  contact: {
    email: {type: String},
    phone: {type: String},
    address: {type: String}
  },
  social: {
    github: {type: String},
    facebook: {type: String},
    twitter: {type: String},
    linkedIn: {type: String},
    stackoverflow: {type: String}
  }
});

Profile = Mongoose.model('Profile', profileSchema);
module.exports = Profile;
