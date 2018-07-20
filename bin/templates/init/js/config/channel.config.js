const {Config} = require('zation');

module.exports = Config.channelConfig(
    {
        default :
            {
                publishAccess : false,
                subscribeAccess : true
            },

        customChannels :
            {

            },

        customIdChannels :
            {

            }
    });