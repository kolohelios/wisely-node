'use strict';

var Project = require('../../../models/project');
var User = require('../../../models/user');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/projects',
    config: {
      description: 'Get an index of projects',
      handler: function(request, reply){
          User.isProjMan(request.auth.credentials._id, function(error, isProjMan){
            if(error){return reply().code(400); }
            Project.find(function(err, projects){
              if(err || !projects){return reply().code(400); }
              if(!isProjMan){
                projects = projects.filter(function(project){
                  return project.client.toString() === request.auth.credentials._id;
                });
              }
              return reply(projects);
            });
          });
        }
      }
  });
  return next();
};

exports.register.attributes = {
  name: 'projects.index'
};
