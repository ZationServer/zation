import {Register, Controller, ControllerConfig, Result, BackError, BackErrorBag, Bag, RequestBag, ObjectModel, Model} from 'zation-server';

@ObjectModel()
class Credentials {

    @Model({
        type: 'email',
    })
    email: string;

    @Model({
        type: 'string',
        minLength: 3
    })
    password: string;

}

@Register().asAuthController()
export class LoginController extends Controller {

    static readonly config: ControllerConfig = {
        access: 'all',
        input: Credentials
    };

    async initialize(bag: Bag) {

    }

    async handle(bag: RequestBag,{email,password}: Credentials) {
        await bag.authenticate('user');
    }

    async finallyHandle(bag: RequestBag, input: any) {

    }

    async invalidInput(bag: RequestBag, rawInput: any, backErrorBag: BackErrorBag) {

    }

}