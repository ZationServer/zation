const {start,Config} = require('zation');

start
(
    Config.starterConfig(
        {
            //options
            debug : {{useDebug}},
            startDebug : {{useStartDebug}},
        })
);