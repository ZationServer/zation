import {Config}          from 'zation-server';
import {LogInController} from "../controllers/auth/logIn";

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
                httpAccess : false,
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