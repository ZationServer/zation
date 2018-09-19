const {Controller,Result,TaskError,TaskErrorBag,ErrorType} = require('zation');
class LogIn extends Controller
{
    async handle(bag,{email,password})
    {
        //check something...
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