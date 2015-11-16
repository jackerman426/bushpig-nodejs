/**
 * Created by jackerman on 14/06/15.
 */
'use strict';

var async = require("async");


module.exports = {

    initialize: function(){

        var self = this;
        async.auto({
            "initializeScraper": function(callback){
                self.initializeScraper(function(error){
                    return callback(error);
                });
            },
            "startScraper": [
                "initializeScraper", function(callback){
                    self.start(callback);
                }
            ]
        }, function(error,results){
                betLogger.info(error,results);
        });



    }

};