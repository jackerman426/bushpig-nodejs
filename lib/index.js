var _ = require("lodash");
var fs = require("node-fs");
var async = require("async");

var service = function Constructor(){};

// Load modules from the modules folder to extend the prototype
var obj = {
    modules: fs.readdirSync(__dirname + '/modules/'),
    connections: fs.readdirSync(__dirname + '/connections/')
};

var files = fs.readdirSync(__dirname + '/modules/');

exports.init = function(next){
    async.forEachOf(obj, function(files, type, callback){
            async.forEach(files, function(file, callback){
                if(file.match(/.*\.js/)){
                    var mod = require('./'+type+'/' + file);
                    _.merge(service.prototype, mod);
                }
                return callback(null);
            }, function(error){
                return callback(error);
            })

    }, function(error){
        return next(error, new service());
    });
};

