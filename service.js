/**
 * Created by jackerman on 14/06/15.
 */
'use strict';

var async = require('async');


async.waterfall([
    function (callback) {
        require('./lib').init(function(error, service){
            if(error){
                betLogger.error("FATAL ERROR: Core modules are not loaded")
                callback(true);
            }else{
                callback(null, service);
            }
        })
    },
    function(service, callback) {
        service.establishConnections(function(error){
            if(error){
                betLogger.error("FATAL ERROR: failed to connect to required resources");
                callback(true);
            }else{
                callback(null, service);
            }
        })
    }
],function(error, service){
    if(!error) service.initialize();
});