import {Bag, DataboxConfig, DataboxFamily, Register} from "zation-server";

@Register('UserProfile')
export default class UserProfileDatabox extends DataboxFamily {

    public static readonly config: DataboxConfig = {
        access : 'allAuth'
    };

    async fetchData(id: string, counter: number): Promise<any> {
        if(counter === 0){
            //SQL Query
            return {
                id : 1,
                name : 'Luca'
            }
        }
        else {
            this.noMoreDataAvailable();
        }
    }

}