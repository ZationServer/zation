import {Receiver, Socket, BackError, BackErrorBag} from 'zation-server';

@Receiver.Config({
    access: 'all',
})
export default class {{name}/pc} extends Receiver {

    async initialize() {

    }

    async handle(socket: Socket, input: any) {

    }

    async invalidInput(socket: Socket, rawInput: any) {

    }

}