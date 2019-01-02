const {Config}        = require('zation-server');
const LogInController = require('./../controllers/auth/logIn');

module.exports = Config.appConfig(
    {
        userGroups :
            {
                auth : {
                    admin : {},
                    user : {},
                },
                default : 'guest'
            },

        controllerDefaults :
            {
                wsAccess : true,
                httpAccess : true,
                httpPostAllowed : true,
                httpGetAllowed : true,
                access : 'all',
            },

        authController : 'logIn',

        controllers :
            {
                logIn : LogInController,
            }
    });