require('./lib').init(function(error, service){
    if(error){
        betLogger.error("FATAL ERROR: Core modules are not loaded")
    }else{
        service.establishConnections(function(error){
            if(error){
                betLogger.error("FATAL ERROR: failed to connect to required resources");
            }else{
                service.start();
            }
        })

    }
});