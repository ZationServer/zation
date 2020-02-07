import {terminal as term} from 'terminal-kit';
import {createClientProject} from "./createClientProject";
import {createServerProject} from "./createServerProject";
import {AbortedCommandError} from "../../shared/abortedCommandError";

export async function createProject(processDir: string, name: string, force: boolean) {
    term.cyan( 'Which type of project do you want to create?\n' );
    const res = await term.singleColumnMenu(['Server','Client'],{cancelable: true}).promise;
    term("\n");
    if(res.canceled) {
        throw new AbortedCommandError();
    }
    else {
        if(res.selectedIndex === 0){
            await createServerProject(processDir,name,force);
        }
        else {
            await createClientProject(processDir,name,force);
        }
    }
}