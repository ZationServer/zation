import {Controller, AuthController, Socket, BackError, BackErrorBag, ObjectModel, Model} from 'zation-server';

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

@Controller.Config({
    access: 'all',
    input: Credentials
})
export default class LoginController extends AuthController {

    async initialize() {

    }

    async handle(socket: Socket,{email,password}: Credentials) {
        await socket.authenticate('user');
    }

    async invalidInput(socket: Socket, rawInput: any) {

    }

}