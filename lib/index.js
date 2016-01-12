/**
 * Created by jackerman on 14/06/15.
 */
'use strict';

var _ = require("lodash");
var fs = require("fs");
var async = require("async");

var service = function Constructor(){};

// Load modules from the modules folder to extend the prototype
var obj = {
    modules: fs.readdirSync(__dirname + '/modules/'),
    connections: fs.readdirSync(__dirname + '/connections/'),
    models: fs.readdirSync(__dirname + '/models/')
};

module.exports.init = function(next){

    async.forEachOf(obj, function(files, type, callback){
        async.forEach(files, function(file, callback){

            if (type == "models") {
                var modelName = file.slice(0, -3);
                //var model = require('./'+type+'/' + modelName);
                var model = require('./models/MarketEvent');
                global.api = global.api || {};
                global.api.models = global.api.models || {};
                global.api.models[modelName] = model;

            } else {

                if (file.match(/.*\.js/)) {
                    var module = require('./'+type+'/' + file);
                    _.merge(service.prototype, module);
                }
            }

            return callback(null);

        }, function(error){
            return callback(error);
        })

    }, function(error){
        return next(error, new service());
    });
};

