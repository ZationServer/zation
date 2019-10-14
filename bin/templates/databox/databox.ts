import {Bag, DataboxConfig, Databox, Register, ZSocket} from "zation-server";

@Register('{{name}}')
export default class {{className}} extends Databox {

    static readonly config: DataboxConfig =
    {

    };

    async fetch(counter: number, session: any, input: any, initData: any, socket: ZSocket)
    {

    }

}