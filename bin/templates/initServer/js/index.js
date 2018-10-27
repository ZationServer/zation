const {start,Config} = require('zation-server');

start
(
    Config.starterConfig(
        {
            //options
            debug : {{useDebug}},
            startDebug : {{useStartDebug}},
        })
);