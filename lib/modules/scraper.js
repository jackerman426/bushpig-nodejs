var betfairService = require('../services/BetfairService');
var async = require('async');

var config = require('./config');

module.exports = {

    initializeScraper: function(callback){
        var self = this;

        self.betfair = new betfairService();

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

    start: function(){

        betLogger.info('Starting..');
        var self = this;
        self.running = true;

        async.whilst(
            function(){
                return self.running;
            },
            function(callback){

            },
            function(error){
                betLogger.error(error, 'ERROR: Scraper has stopped!')
                process.exit(1);
            }
        )
    },

    stop: function(){
        this.running = false;
    },

    getData: function(){

    }

};