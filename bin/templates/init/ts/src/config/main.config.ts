import {Config} from 'zation';

exports = Config.mainConfig(
    {
        port: {{port}},
        appName : '{{appName}}',

        timeZone : '{{timeZone}}',
    });