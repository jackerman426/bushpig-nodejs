/**
 * Created by jackerman on 14/09/15.
 */
var mongoose = require('mongoose');

function MongoController() {
    this.db = null;
    this.mongoose = null;S
}

MongoController.prototype.initialize = function(mongoUrl) {
    this.mongoose = mongoose;

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

    this.mongoose.connect(this.mongoUrl, options, function(error){
        if(error){
            next(error);
        }else{
            this.db = mongoose.connection;
            next(null);
        }
    });

};

module.exports = new MongoController();