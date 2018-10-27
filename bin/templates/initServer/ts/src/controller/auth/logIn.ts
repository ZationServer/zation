import {Controller,Result,TaskError,TaskErrorBag,ErrorType} from 'zation-server';
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