import {Bag, DataboxConfig, DataboxFamily, Register} from "zation-server";

@Register('{{name}}')
export default class {{className}} extends DataboxFamily {

    static readonly config: DataboxConfig =
    {

    };

    async fetch(id: string, counter: number, session: any, input: any, initData: any, socket: ZSocket)
    {

    }

    async isIdValid(id: string, bag: Bag)
    {

    }

}