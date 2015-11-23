/**
 * Created by jackerman on 14/06/15.
 */
'use strict';
var fs = require('fs');

module.exports = {
    connectionData: {
        port: process.env.PORT || 3000,
        mongoLabUri: process.env.MONGOLAB_URI || 'mongodb://localhost/cougar',
        credentials: {
            username: process.env.username || null,
            password: process.env.password || null
        },
        sslOptions: {
            key: fs.existsSync("lib/services/config/certificates/client-2048.key") && fs.readFileSync("lib/services/config/certificates/client-2048.key"),
            cert: fs.existsSync("lib/services/config/certificates/client-2048.crt") && fs.readFileSync("lib/services/config/certificates/client-2048.crt")

        },
        betfairAppKey: process.env['BETFAIR_DELAYED_APIKEY'] || null
    },
    betQueryParams: {
        filter:{
            eventTypeIds: ['7'] // 7 is for horse racing
        }
    }
};