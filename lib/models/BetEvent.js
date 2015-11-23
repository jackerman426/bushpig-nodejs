/**
 * Created by mariostzakris on 23/11/15.
 */
var BetEvent = function(){
    this.marketId = null;
    this.marketStartTime = null; //The start time of the market
    this.numberOfWinners = null, //The number of selections that could be settled as winners

    this.timeData = [{
        totalMatched : null, //The total amount matched
        numberOfActiveRunners : null, //The number of runners that are currently active. An active runner is a selection available for betting
        lastMatchTime : null, //The most recent time an order was executed
        status : null, //The status of the market, for example OPEN, SUSPENDED, CLOSED (settled), etc.
        inplay : null, //True if the market is currently in play
        totalAvailable : null//The total amount of orders that remain unmatched
    }];

    this.runners = [{
        selectionId : null,
        adjustmentFactor: null,
        lastPriceTraded : null,
        priceTimeSeries: [
            {timeStamp: null,

            }
        ]}
    ];


    this.priceTimeSeries = [
        {timeStamp: null,

        }
    ]
};