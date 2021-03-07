import {DataboxFamily, FetchRequest, DbFamilyInConnection} from 'zation-server';

@DataboxFamily.Config({
    access: 'all',
})
export default class {{name}/pc} extends DataboxFamily {

    async fetch(request: FetchRequest, connection: DbFamilyInConnection) {

    }

}