const {Config} = require('zation');

module.exports = Config.channelConfig(
    {
        default :
            {
                publish : false,
                subscribe : true
            },

        customChannels :
            {

            },

        customIdChannels :
            {

            }
    });