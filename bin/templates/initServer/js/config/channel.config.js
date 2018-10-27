const {Config} = require('zation-server');

module.exports = Config.channelConfig(
    {
        customChannels :
            {
                default :
                    {
                        clientPublishAccess : false,
                        subscribeAccess : true,
                    },
            },

        customIdChannels :
            {
                default :
                    {
                        clientPublishAccess : false,
                        subscribeAccess : true,
                    },
            },
    });