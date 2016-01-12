var async = require('async');
var moment = require('moment');

var betfairService = require('../services/BetfairService');
var connectionData = require('./config').connectionData;
var _ = require("lodash");

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
                var now = new moment()

                async.waterfall([

                    function(callback){

                        self.getData(now, function(error, data){
                            return callback(error, data);
                        });

                    },
                    function(data, callback){

                        self.saveMarketEvents(data.marketBook, data.marketCatalogue, now, function(error){
                            return callback(error);
                        })

                    },
                    function(callback){
                        setTimeout(callback, 20000 );
                    }

                ], function(error){
                    return callback(error);
                });



            },
            function(error){
                betLogger.error(error, 'ERROR: Bushpig scraper has stopped!')
                process.exit(1);
            }
        )
    },

    stop: function(){
        this.running = false;
    },

    getData: function(now, next){

        var self = this;

        var newMarketEvent = new api.models.MarketEvent();


        async.auto({
            get_market_catalogue: function(callback){
                self.getMarketCatalogue(now, function(error, marketCatalogue){
                    return callback(error, marketCatalogue);
                })
            },
            get_market_book: ['get_market_catalogue', function(callback, result){
                var marketCatalogue = result['get_market_catalogue'];
                var marketIds = _.map(marketCatalogue, 'marketId');
                self.getMarketBook(marketIds, function(error, marketBook){
                    return callback(error, marketBook);
                })
            }],
            prepare_response: ['get_market_catalogue', 'get_market_book', function(callback, results){
                var marketCatalogue = results['get_market_catalogue'];
                var marketBook = results['get_market_book'];
                var response = {marketCatalogue: marketCatalogue, marketBook: marketBook};

                return callback(null, response);

            }]
        }, function(error, results) {
                return next(error, results['prepare_response']);
        });



    },

    saveMarketEvents: function(marketBook, marketCatalogue, now, next) {

        var self = this;

        async.forEach(marketBook, function(marketBookItem, callback){

            var marketCatalogueItem = _.filter(marketCatalogue, function(item){
                return item.marketId == marketBookItem.marketId;
            });
            var marketEvent = self.formMarketEvent(marketBookItem, marketCatalogueItem[0], now);

            async.waterfall([

                function(callback){
                    api.models.MarketEvent.findOne({marketId: marketEvent.marketId})
                        .exec(function(error, marketEventRecord){
                            return callback(error, marketEventRecord);
                        })
                },
                function(marketEventRecord, callback){
                    if(marketEventRecord){
                        marketEvent.update({marketId: marketEvent.marketId}, {$push:{timeData:marketEvent.timeData}}, function(error){
                            if(error){
                                betLogger.error(error);
                            }else{
                                betLogger.info("MarketEvent: " + marketEvent.marketId + " has been successfully updated");
                            }
                            return callback(error);
                        })
                    } else {
                        marketEvent.save(function(error){
                            if(error){
                                betLogger.error(error);
                            }else{
                                betLogger.info("MarketEvent: " + marketEvent.marketId + " has been successfully saved");
                            }
                            return callback(error);
                        })
                    }
                }

            ], function(error){
                return callback(error);
            })

        }, function(error){
            betLogger.info("------------------------------------------------------");
            return next(error);
        })

    },


    formMarketEvent: function(marketBookItem, marketCatalogueItem, now){
        var marketEvent = new api.models.MarketEvent();
        marketEvent.marketId = marketCatalogueItem.marketId;
        marketEvent.marketStartTime = moment(marketCatalogueItem.marketStartTime).add(-1, 'hours');
        marketEvent.totalMatched = marketCatalogueItem.totalMatched;
        marketEvent.numberOfWinners = marketBookItem.numberOfWinners;

        marketEvent.timeData = {
            timeStamp: now,
            totalMatched: marketBookItem.totalMatched,
            numberOfActiveRunners: marketBookItem.numberOfActiveRunners,
            numberOfRunners: marketBookItem.numberOfRunners,
            numberOfWinners: marketBookItem.numberOfWinners,
            status: marketBookItem.status,
            inplay: marketBookItem.inplay,
            betDelay: marketBookItem.betDelay,
            totalAvailable: marketBookItem.totalAvailable,
            complete: marketBookItem.complete,
            bspReconciled: marketBookItem.bspReconciled,
            crossMatching: marketBookItem.crossMatching,
            runners: marketBookItem.runners
        };

        return marketEvent;

    },

    getMarketCatalogue: function(now, next){
        var self = this;

        self['now'] = moment(now);

        var timeWindow = {
            from: self.now.format('YYYY-MM-DTHH:mm:ss'),
            to: self.now.add(0.5, 'hours').format('YYYY-MM-DTHH:mm:ss')
        };

        var params = {
            filter: {
                eventTypeIds: [7],
                marketStartTime:timeWindow
                //marketTypeCodes:['MATCH_ODDS']
            },
            sort: 'MAXIMUM_TRADED',
            marketProjection: ['MARKET_START_TIME'],
            maxResults: 200
        };
        self.betfair.listMarketCatalogue(params, function(error, marketCatalogue){
            next(error, marketCatalogue);
        });
    },

    getMarketBook: function(marketIds, next){
        var self = this;
        var params = {
            marketIds: marketIds,
            priceProjection:{
                priceData:["EX_BEST_OFFERS"],
                virtualise:"true"}
            //orderProjection: ['EXECUTABLE']
        };
        self.betfair.listMarketBook(params, function(error, marketBook){
            next(error, marketBook);
        });
    }

};