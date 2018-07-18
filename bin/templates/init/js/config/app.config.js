const {Config} = require('zation');

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

        versionControl :
            {
                Default : 1.0,
            },

        validationGroups :
            {

            },

        objects :
            {

            },

        controllerDefault :
            {
                wsAccess : true,
                httpAccess : true,
                access : 'all',
            },

        authController : 'logIn',

        controller :
            {
                logIn :
                {
                    name : 'logIn',
                    path : 'auth',
                    access : 'all',

                    input :
                        {
                            userGroup :
                                {
                                    type : 'string',
                                    isOptional : true
                                },
                        },
                },
            }
    });