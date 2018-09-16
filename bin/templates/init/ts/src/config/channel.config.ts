import {Config} from 'zation';

module.exports = Config.channelConfig(
    {
        customChannels :
            {
                default :
                    {
                        publishAccess : false,
                        subscribeAccess : true,
                    },
            },

        customIdChannels :
            {
                default :
                    {
                        publishAccess : false,
                        subscribeAccess : true,
                    },
            },
    });