/**
 * Created by jackerman on 14/06/15.
 */
'use strict';

var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');

function MongoController() {
    this.db = null;
    this.mongoose = null;
}

MongoController.prototype.initialize = function(mongoUrl) {;
    this.mongoose = mongoose;
    if(mongoUrl) {
        this.mongoUrl = mongoUrl;
    }
};

MongoController.prototype.connect = function(next) {

    var self = this;
    /**
     * Connect to mongodb
     */
    var options = {
        server: {
            auto_reconnect: true, //default
            socketOptions: {
                keepAlive: 1,
                connectTimeoutMS: 30000
            },
            poolSize: 5
        },
        replset: {
            socketOptions: {
                keepAlive: 1,
                connectTimeoutMS: 30000
            }
        }
    };
    self.mongoose.connect(self.mongoUrl, options);

    self.db = self.mongoose.connection;;

    // Initialize mongoose event listeners
    self.db.once('open', function () {
        betLogger.info("Mongo is connecting...")
        next(null);
    });

    self.db.on('error', function (error) {
        betLogger.error(error);
    });

    self.db.on('connecting', function () {
        betLogger.info("Mongo is connecting");
    });

    self.db.on('reconnected', function () {
        betLogger.info("Mongo has reconnected");
    });

        //if(error){
            //next(error);
        //}else{


        //}
    //});

};

module.exports = new MongoController();