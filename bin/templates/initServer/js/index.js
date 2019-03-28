const {start}        = require('zation-server');
const StarterConfig  = require('./configs/starter.config');

(async () => {
    await start(StarterConfig,process.env.START_MODE);
})();