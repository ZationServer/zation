const {Config} = require('zation');

module.exports = Config.mainConfig(
    {
        port: {{port}},
        appName : '{{appName}}',{{timeZone}}
    });