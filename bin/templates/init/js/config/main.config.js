const {Config} = require('zation');

module.exports = Config.mainConfig(
    {
        port: {{port}},
        appName : '{{appName}}',{{timeZone}}
        usePanel : true,
        panelUser : {userName: '{{panelUserName}}', password: '{{panelPassword}}'},
    });