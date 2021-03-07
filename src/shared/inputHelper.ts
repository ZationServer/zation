import { AbortedCommandError } from './abortedCommandError';
import {terminal as term} from 'terminal-kit';

export async function askInput(prompt : string, defaultValue : string) : Promise<string>;
export async function askInput(prompt : string, defaultValue ?: undefined) : Promise<string | undefined>;
export async function askInput(prompt : string, defaultValue : string | undefined) : Promise<string> {
    return new Promise<string>((resolve,reject) => {
        term(prompt + ": ");
        term.inputField({
            default : defaultValue,
            cancelable : true
        },(error,input)=> {
            if(error) {reject(error);}
            term("\n");
            if(input === undefined){
                reject(new AbortedCommandError());
            }
            else {
                resolve(input);
            }
        });
    });
}

export async function yesOrNo(question: string,defaultValue: boolean = true): Promise<boolean> {
    term(question + ' [' + (defaultValue ? '\x1b[36my\x1b[0m\x1b[0m|n] ' : 'y|\x1b[36mn\x1b[0m\x1b[0]]'));
    const res = await term.yesOrNo( { yes: [ 'y',...(defaultValue ? ['ENTER'] : []) ] ,
        no: [ 'n',...(defaultValue ? [] : ['ENTER']) ] }).promise;
    if(res == null) {
        term("\n");
        throw new AbortedCommandError();
    }
    else {
        term(res ? ' Yes' : ' No');
        term("\n");
        return res;
    }
}