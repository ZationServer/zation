import {Channel, Socket} from "zation-server";

@Channel.Config({
    access: 'all'
})
export default class {{name}/pc} extends Channel {

    protected async onSubscription(member, socket: Socket) {

    }

}