import {Controller,ControllerConfig,Result,TaskError,TaskErrorBag,Bag,SmallBag} from 'zation-server';
export class LogInController extends Controller
{
    static config : ControllerConfig = {
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
    };

    async handle(bag : Bag,{email,password}) {
        await bag.authenticate('user');
    }

    async initialize(smallBag : SmallBag)
    {

    }

    async wrongInput(bag : Bag,input)
    {

    }
}