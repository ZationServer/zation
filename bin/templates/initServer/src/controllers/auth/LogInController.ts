import {Register, Controller, ControllerConfig, Result, BackError, BackErrorBag, Bag, RequestBag, ObjectModel, Model} from 'zation-server';

@ObjectModel()
class LogInCredentials {

    @Model({
        type : 'email',
    })
    email : string;

    @Model({
        type : 'string',
        minLength : 3
    })
    password : string;

}

@Register('logIn').asAuthController()
export class LogInController extends Controller
{
    static config : ControllerConfig = {
        access : 'all',
        input : LogInCredentials
    };

    async initialize(bag: Bag)
    {

    }

    async handle(bag : RequestBag,{email,password} : LogInCredentials) {
        await bag.authenticate('user');
    }

    async finallyHandle(bag: RequestBag, input: any)
    {

    }

    async invalidInput(bag: RequestBag, input: any, backErrorBag: BackErrorBag)
    {

    }
}