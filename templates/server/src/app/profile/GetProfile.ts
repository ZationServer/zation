import {API, Databox, FetchRequest, DbInConnection} from "zation-server";

@API("get")
@Databox.Config({
    access: 'allAuth'
})
export default class GetProfile extends Databox<{
    id: string,
    name: string
}> {

    protected async singleFetch(request: FetchRequest, connection: DbInConnection) {
        //Database query...
        return {
            id: "1",
            name: 'Luca'
        };
    }

}