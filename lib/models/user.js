/* eslint no-reserved-keys: 0 */

'use strict';

var Bcrypt = require('bcrypt');
var Mongoose = require('mongoose');
var Jwt = require('jwt-simple');
var Moment = require('moment');
var User;

var userSchema = Mongoose.Schema({
  email: {type: String, lowercase: true, required: true},
  password: {type: String, select: false, required: true},
  role: {type: String, default: 'viewer', required: true},
  createdAt: {type: Date, default: Date.now, required: true}
});

userSchema.methods.token = function(env){
  var payload = {
    sub: this._id,
    iat: Moment().unix(),
    exp: Moment().add(env.LOCAL_EXPIRE, 'hours').unix()
  };

  return Jwt.encode(payload, env.LOCAL_SECRET);
};

userSchema.statics.register = function(o, cb){
  User.findOne({email: o.email}, function(err, user){
    if(err || user){ return cb(err); }

    user = new User(o);
    user.password = Bcrypt.hashSync(o.password, 8);
    user.save(cb);
  });
};

userSchema.statics.authenticate = function(o, cb){
  User.findOne({email: o.email}, '+password', function(err, user){
    if(err || !user){ return cb(err); }

    var isGood = Bcrypt.compareSync(o.password, user.password);
    if(!isGood){ return cb(null); }

    user.password = null;
    cb(null, user);
  });
};

User = Mongoose.model('User', userSchema);
module.exports = User;
