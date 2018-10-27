const {Config} = require('zation-server');

module.exports = Config.eventConfig(
    {
        express : Config.express((smallBag, express) =>
        {
            express.get('/',(req,res) =>
            {
                res.send('Application Server');
            });
        }),

    });