import {Config}          from 'zation-server';

//Controllers
import "../controllers/auth/LoginController";

//Databoxes
import "../databoxes/ProfileDatabox";

export default Config.appConfig(
    {
        userGroups:
            {
                auth: {
                    admin: {},
                    user: {},
                },
                default: 'guest'
            },

        controllerDefaults:
            {
                wsAccess: true,
                httpAccess: false,
                httpPostAllowed: true,
                httpGetAllowed: true,
                access: 'all'
            }
    });