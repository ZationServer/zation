import {Databox, DataboxFamily, FetchRequest, DbFamilyInConnection} from "zation-server";

@Databox.Config({
    access: 'allAuth'
})
export default class GetDatabox extends DataboxFamily {

    async singleFetch(request: FetchRequest, connection: DbFamilyInConnection) {
        //Database query...
        return {
            id: 1,
            name: 'Luca'
        };
    }

}