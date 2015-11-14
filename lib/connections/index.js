var mongoController = require('./controllers/mongoController');

/**
 * Establish connection to mongoDB
 */

var mongoUrl = process.env.MONGOLAB_URI || 'mongodb://localhost/cougar';

module.exports = {

    establishConnections : function(next){
        mongoController.initialize(mongoUrl);
        mongoController.connect(function(error){
            if(error){
                betLogger.error("MONGODB ERROR: " + error);
            }else{
                betLogger.info("Mongo connection opened");
                return next(null);
            }
        });
    }
};
