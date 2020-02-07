import {Config} from 'zation-server';

module.exports = Config.mainConfig(
    {
        port: {{port}},
        appName: '{{name}/pc}',
        usePanel: true,
        panelUser: {username: 'admin', password: 'admin'},
    });