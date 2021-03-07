import {Controller, Socket, BackError, BackErrorBag} from 'zation-server';

@Controller.Config({
    access: 'all',
})
export default class {{name}/pc} extends Controller {

    async initialize() {

    }

    async handle(socket: Socket, input: any) {

    }

    async invalidInput(socket: Socket, rawInput: any) {

    }

}