/**
 * Created by jackerman on 14/06/15.
 */
'use strict';

var MongoClient = require('mongodb').MongoClient;

function MongoController() {
    this.db = null;
}

MongoController.prototype.initialize = function(mongoUrl) {;

    if(mongoUrl) {
        this.mongoUrl = mongoUrl;
    }
};

MongoController.prototype.connect = function(next) {

    var self = this;

    var options = {
        server: {
            auto_reconnect: true, //default
            socketOptions: {
                keepAlive: 1,
                connectTimeoutMS: 30000
            }
        },
        replset: {
            socketOptions: {
                keepAlive: 1,
                connectTimeoutMS: 30000
            }
        }
    };

    /**
     * Connect to mongodb with mongoose
     */

    MongoClient.connect(self.mongoUrl, function(error, db){
        if(error){
            next(error);
        }else{
            self.db = db;
            next(null);
        }
    });

};

module.exports = new MongoController();