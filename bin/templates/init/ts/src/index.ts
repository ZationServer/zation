import {start,Config} from 'zation';

start
(
    Config.starterConfig(
        {
            //options
            debug : {{useDebug}},
            startDebug : {{useStartDebug}},
        })
);