import {Config} from 'zation-server';

module.exports = Config.mainConfig(
    {
        port: {{port}},
        appName : '{{appName}}',{{timeZone}}
        usePanel : true,
        panelUser : {username: '{{panelUserName}}', password: '{{panelPassword}}'},
    });