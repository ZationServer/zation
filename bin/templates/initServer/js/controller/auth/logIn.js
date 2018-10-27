const {Controller,Result,TaskError,TaskErrorBag,ErrorType} = require('zation-server');
class LogIn extends Controller
{
    async handle(bag,{email,password})
    {
        await bag.authenticate('user');
    }

    async initialize(smallBag)
    {

    }

    async wrongInput(bag,input)
    {

    }

}
module.exports = LogIn;