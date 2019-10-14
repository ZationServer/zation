import {Register, Controller, ControllerConfig, Result, BackError, BackErrorBag, Bag, RequestBag} from 'zation-server';

@Register('{{name}}')
export default class {{className}} extends Controller
{
    static readonly config: ControllerConfig =
    {

    };

    async initialize(bag: Bag)
    {

    }

    async handle(bag: RequestBag,{})
    {

    }

    async finallyHandle(bag: RequestBag, input: any)
    {

    }

    async invalidInput(bag: RequestBag, input: any, backErrorBag: BackErrorBag)
    {

    }
}