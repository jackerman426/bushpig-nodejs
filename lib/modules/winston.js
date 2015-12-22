/**
 * Created by jackerman on 14/06/15.
 */
'use strict';

var winston = require("winston");

/**
 * Winston logger
 */
var betLogger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        //new (winston.transports.File)({filename: 'logs/info-error.log'})
    ]
});

if (!global.betLogger){
    global['betLogger'] = betLogger;
}