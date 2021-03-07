import {start}       from 'zation-server';
import StarterConfig from './configs/starter.config';

(async () => {
    await start(StarterConfig,process.env.MODE);
})();