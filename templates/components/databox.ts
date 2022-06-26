import {Databox, FetchRequest, DbInConnection} from "zation-server";

@Databox.Config({
    access: 'all',
})
export default class {{name}/pc} extends Databox {

    protected async fetch(request: FetchRequest, connection: DbInConnection) {

    }

}