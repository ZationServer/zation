import {start,Config} from 'zation-server';

start
(
    Config.starterConfig(
        {
            //options
            debug : {{useDebug}},
            startDebug : {{useStartDebug}},
        })
);