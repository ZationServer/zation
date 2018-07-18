import {Config} from 'zation';

module.exports = Config.eventConfig(
    {
        express : (smallBag, express) =>
        {
            express.get('/',(req,res) =>
            {
                res.send('Application Server');
            });
        }

    });