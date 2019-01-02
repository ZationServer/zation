const {Config,Controller,Result,TaskError,TaskErrorBag} = require('zation-server');
class LogInController extends Controller
{
    async handle(bag,{email,password}) {
        await bag.authenticate('user');
    }

    async initialize(smallBag)
    {

    }

    async wrongInput(bag,input)
    {

    }

}

LogInController.config = Config.controllerConfig({
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
        }
});

module.exports = LogInController;