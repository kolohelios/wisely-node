'use strict';

exports.get = function(){
  var env = process.env.NODE_ENV || 'development';

  var common = {
    NODE_ENV: env,
    LOCAL_SECRET: process.env.LOCAL_SECRET,
    MANDRILL_API_KEY: process.env.MANDRILL_API_KEY,
    TWILIO_TOKEN: process.env.TWILIO_TOKEN,
    LOCAL_EXPIRE: 24
  };

  var environments = {
    development: {
      PORT: process.env.PORT || 8000,
      MONGO_URL: 'mongodb://localhost/wisely-dev'
    },
    test: {
      PORT: process.env.PORT || 0,
      MONGO_URL: 'mongodb://localhost/wisely-test',
      LOCAL_EXPIRE: Infinity,
      LOCAL_TOKEN: process.env.LOCAL_TOKEN
    },
    production: {
      PORT: process.env.PORT || 0,
      MONGO_URL: 'mongodb://heroku.mongolab.com/wisely-production'
    }
  };

  var environment = environments[env];

  Object.keys(common).forEach(function(key){
    if(!environment[key]){
      environment[key] = common[key];
    }
  });

  return environment;
};
