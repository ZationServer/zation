import {Controller,Result,TaskError,TaskErrorBag,ErrorType} from 'zation';
class LogIn extends Controller
{
    async handle(bag,{email,password})
    {
        //chek something...
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