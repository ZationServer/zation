import {Config} from 'zation-server';

export default Config.mainConfig(
    {
        port: {{port}},
        appName: '{{name}/pc}',
        usePanel: true,
        panelUser: {username: 'admin', password: 'admin'},
    });