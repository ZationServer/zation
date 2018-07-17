import {Config} from 'zation';

exports = Config.eventConfig(
    {
        express : (smallBag, express) =>
        {
            express.get('/',(req,res) =>
            {
                res.send('Application Server');
            });
        }

    });