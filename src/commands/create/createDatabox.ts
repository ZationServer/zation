import {terminal as term} from 'terminal-kit';
import {Component, createComponent} from "./createComponent";
import {AbortedCommandError} from "../../shared/abortedCommandError";

export async function createDatabox(processDir: string, name: string, force: boolean): Promise<void> {
    term.cyan('Which type of databox do you want to create?\n');
    const res = await term.singleColumnMenu(['Databox', 'DataboxFamily'],{cancelable: true}).promise;
    term("\n");
    if(res.canceled) {
        throw new AbortedCommandError();
    }
    else {
        await createComponent(res.selectedIndex === 0 ? Component.Databox : Component.DataboxFamily,
            processDir,name,force);
    }
}