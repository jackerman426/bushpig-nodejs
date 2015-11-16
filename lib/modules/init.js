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
                self.initializeScraper(callback);
            },
            "startScraper": [
                "initializeScraper", function(callback){
                    self.startScraper(callback);
                }
            ]
        }, function(error,results){
                betLogger.info(error,results);
        });



    }

};