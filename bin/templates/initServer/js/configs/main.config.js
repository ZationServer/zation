const {Config} = require('zation-server');

module.exports = Config.mainConfig(
    {
        port: {{port}},
        appName : '{{appName}}',{{timeZone}}
        usePanel : true,
        panelUser : {userName: '{{panelUserName}}', password: '{{panelPassword}}'},
    });