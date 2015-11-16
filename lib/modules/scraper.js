var betfairService = require('../services/BetfairService');
var async = require('async');

var config = require('./config');

module.exports = {

    initializeScraper: function(callback){
        var self = this;

        self.betfair = betfairService;

        //initialize betfair service
        self.betfair.initialize(config.credentials, config.betfairAppKey, config.sslOptions, true);

        self.running = false;

        //login to betfair
        self.betfair.login(function(error){
            if(error){
                return callback(error);
            }else{
                return callback(null);
            }
        });
    },

    startScraper: function(){

        var self = this;

        betLogger.info('Starting..');

        var params = {filter: {eventTypeIds:["1"]}};

        self.betfair.listEvents(params, function(error, result){
            betLogger.info("kresa");
        })
    }

}