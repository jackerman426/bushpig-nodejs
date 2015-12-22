/**
 * Created by mariostzakris on 23/11/15.
 */

'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MarketEventSchema = new Schema({
    marketId: {type: String, index: true, required: true},
    marketStartTime: Date, //The start time of the market
    numberOfWinners: Number, //The number of selections that could be settled as winners
    timeData: [{
        timeStamp: Date,
        totalMatched: Number,
        numberOfActiveRunners: Number,
        numberOfRunners: Number,
        numberOfWinners: Number,
        status: String,
        inplay: Boolean, //True if the market is currently in play
        betDelay: Number, //The number of seconds an order is held until it is submitted into the market. Orders are usually delayed when the market is in-play
        totalAvailable: Number, //True if the market is currently in play
        complete: Boolean, //If false, runners may be added to the market
        bspReconciled: Boolean, //True if the market starting price has been reconciled
        crossMatching: Boolean, //True if cross matching is enabled for this market.
        runners: [{
            adjustmentFactor: Number,
            ex: {availableToBack: [{
                    price: Number,
                    size: Number
                }],
                availableToLay:[{
                    price: Number,
                    size: Number
                }],
                tradedVolume: [{
                    price: Number,
                    size: Number
                }]
            },
            handicap: Number,
            selectionId : Number
        }]
    }]
});


MarketEventSchema.pre('validate', function (next) {
    next();
});

// specify the transform schema option
if (!MarketEventSchema.options.toJSON) MarketEventSchema.options.toJSON = {};
MarketEventSchema.options.toJSON.transform = function (doc, ret, options) {
    // remove the _id, __v of every document before returning the result
    delete ret._id;
    delete ret.__v;

    return ret;

};

var MarketEventodel = mongoose.model('MarketEvent', MarketEventSchema);

module.exports = MarketEventodel;