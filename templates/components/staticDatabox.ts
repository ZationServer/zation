import {StaticDatabox, FetchRequest, StaticDbInConnection} from "zation-server";

@StaticDatabox.Config({
    access: 'all',
})
export default class {{name}/pc} extends StaticDatabox {

    protected async fetch(request: FetchRequest, connection: StaticDbInConnection) {

    }

}