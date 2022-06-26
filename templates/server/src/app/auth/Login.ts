import {Controller, AuthController, Socket, BackError, BackErrorBag, ObjectModel, Model, ModelProp} from 'zation-server';

@ObjectModel()
class Credentials {

    email = ModelProp({
        type: 'email',
    });

    password = ModelProp({
        type: 'string',
        minLength: 3
    });

}

@Controller.Config({
    access: 'all',
    input: Credentials
})
export default class Login extends AuthController {

    async initialize() {

    }

    async handle(socket: Socket,{email,password}: Credentials) {
        await socket.authenticate('user');
    }

    async invalidInput(socket: Socket, rawInput: any) {

    }

}