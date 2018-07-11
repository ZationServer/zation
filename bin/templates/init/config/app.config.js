module.exports =
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
                socketAccess : true,
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
    };