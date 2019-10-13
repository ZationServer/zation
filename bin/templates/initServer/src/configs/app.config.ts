import {Config}          from 'zation-server';

import "../controllers/auth/LogInController";

import "../databoxes/ProfileDatabox";

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
                access : 'all'
            }
    });