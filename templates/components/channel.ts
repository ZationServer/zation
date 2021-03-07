import {Channel, Socket} from 'zation-server';

@Channel.Config({
    access: 'all',
})
export default class {{name}/pc} extends Channel {

    async onSubscription(socket: Socket) {

    }

}