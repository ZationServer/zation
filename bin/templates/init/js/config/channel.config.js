const {Config} = require('zation');

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