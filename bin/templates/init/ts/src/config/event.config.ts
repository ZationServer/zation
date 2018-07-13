import {Config} from 'zation';

export = Config.eventConfig(
    {
        express : (smallBag, express) =>
        {
            express.get('/',(req,res) =>
            {
                res.send('Application Server');
            });
        }

    });