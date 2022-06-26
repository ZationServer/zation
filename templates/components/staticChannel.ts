import {StaticChannel, Socket} from "zation-server";

@StaticChannel.Config({
    access: 'allAuth'
})
export default class {{name}/pc} extends StaticChannel {

    protected async onSubscription(socket: Socket) {

    }

}