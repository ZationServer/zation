const {Config} = require('zation-server');

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

        controller :
            {
                logIn :
                {
                    fileName : 'logIn',
                    filePath : 'auth',
                    access : 'all',

                    input :
                        {
                            email :
                                {
                                    type : 'email',
                                },
                            password :
                                {
                                    type : 'string',
                                    minLength : 3
                                },
                        },
                },
            }
    });