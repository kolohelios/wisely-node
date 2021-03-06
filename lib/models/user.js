/* eslint no-reserved-keys: 0 */

'use strict';

var Bcrypt = require('bcrypt');
var Mongoose = require('mongoose');
var Jwt = require('jwt-simple');
var Moment = require('moment');
var User;

var userSchema = Mongoose.Schema({
  email: {type: String, lowercase: true, required: true},
  firstName: {type: String},
  lastName: {type: String},
  password: {type: String, select: false},
  phone: {type: String},
  role: {type: Number, default: 1, required: true},
  contactPref: {type: String, required: true},
  createdAt: {type: Date, default: Date.now, required: true}
});

userSchema.methods.token = function(env){
  var payload = {
    sub: this._id,
    iat: Moment().unix(),
    exp: Moment().add(env.LOCAL_EXPIRE, 'hours').unix(),
    rol: this.role
  };

  return Jwt.encode(payload, env.LOCAL_SECRET);
};

userSchema.statics.register = function(o, cb){
  User.findOne({email: o.email}, function(err, user){
    if(user || err){ return cb(err).code(400); }

    user = new User(o);
    user.password = Bcrypt.hashSync(o.password, 8);
    user.save(cb);
  });
};

userSchema.statics.authenticate = function(o, cb){
  User.findOne({email: o.email}, '+password', function(err, user){
    if(!user || err){ return cb(err); }

    var isGood = Bcrypt.compareSync(o.password, user.password);
    if(!isGood){return cb(null); }

    user.password = null;
    cb(null, user);
  });
};

userSchema.statics.isAdmin = function(userId, cb){
  User.findById(userId, function(err, user){
    if(!user || err){ return cb(err); }

    if(user.role === 255){
      return cb(null, true);
    }

    return cb(null, false);
  });
};

userSchema.statics.isProjMan = function(userId, cb){
  User.findById(userId, function(err, user){
    if(!user || err){ return cb(err); }

    if(user.role >= 127){
      return cb(null, true);
    }

    return cb(null, false);
  });
};

userSchema.statics.isAuthorized = function(client, userId, cb){
  User.findById(userId, function(err, user){
    if(!user || err){ return cb(err); }

    if(user.role >= 127 || user._id.toString() === client.toString()){
      return cb(null, true);
    }
    return cb(null, false);
  });
};

User = Mongoose.model('User', userSchema);
module.exports = User;
