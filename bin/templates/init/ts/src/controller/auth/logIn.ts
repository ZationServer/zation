import {Controller,Result,TaskError,TaskErrorBag,ErrorType} from 'zation';
class LogIn extends Controller
{
    async handle(bag,{userName,password})
    {
        //check something with the input...
        await bag.authTo('user');
    }

    async initialize(smallBag)
    {

    }

    async wrongInput(bag,input)
    {

    }

}
module.exports = LogIn;