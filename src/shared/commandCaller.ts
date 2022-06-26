/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {AbortedCommandError} from "./abortedCommandError";
import {print} from "./consoleHelper";

export async function callCommandSafe<T extends (...args: any[]) => Promise<void> | void>(command: T, ...args: Parameters<T>) {
    try{
        await command(...args);
        process.exit();
    }
    catch(e) {
        if(e instanceof AbortedCommandError) {
            if(!e.Silent)
                print.newLine();
                print.warning("Command aborted.");
            process.exit();
        }
        else throw e;
    }
}