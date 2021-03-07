import {ChannelFamily, Socket} from 'zation-server';

@ChannelFamily.Config({
    access: 'all',
})
export default class {{name}/pc} extends ChannelFamily {

    async onSubscription(member, socket: Socket) {

    }

}