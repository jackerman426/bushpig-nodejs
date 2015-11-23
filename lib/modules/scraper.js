var async = require('async');
var moment = require('moment');

var betfairService = require('../services/BetfairService');
var connectionData = require('./config').connectionData;
var betQueryParams = require('./config').betQueryParams;

module.exports = {

    initializeScraper: function(callback){
        var self = this;

        self.betfair = new betfairService();

        //initialize betfair service
        self.betfair.initialize(
            connectionData.credentials,
            connectionData.betfairAppKey,
            connectionData.sslOptions,
            true);

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

        betLogger.info('Starting...');

        var self = this;
        self.running = true;

        async.whilst(
            function(){
                return self.running;
            },
            function(callback){
                var now = new moment();
                self.getData(now);
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

    getData: function(now, callback){

        var self = this;
        self.timestamp = new moment();

        async.waterfall([
            function(callback){
                var params = {
                    filter: {
                        eventTypeIds: [7],
                        marketStartTime:{
                            from: now.format('YYYY-MM-DTHH:mm:ss'),
                            to: now.add(0.5, 'hours').format('YYYY-MM-DTHH:mm:ss')
                        }
                        //marketTypeCodes:['MATCH_ODDS']
                    },
                    sort: 'MAXIMUM_TRADED',
                    marketProjection: ['MARKET_START_TIME'],
                    maxResults: 200
                };
                self.betfair.listMarketCatalogue(params, function(error, marketIds){
                    callback(error, marketIds);
                });
            },
            function(marketIds, callback){
                var params = {
                    marketIds: marketIds,
                    priceProjection:{
                        priceData:["EX_BEST_OFFERS"],
                        virtualise:"true"}
                    //orderProjection: ['EXECUTABLE']
                };
                self.betfair.listMarketBook(params, function(error, marketIds){
                    callback(error, marketIds);
                });
            }
        ],callback);



    }

};