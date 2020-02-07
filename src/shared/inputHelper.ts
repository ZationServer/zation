import { AbortedCommandError } from './abortedCommandError';
import {terminal as term} from 'terminal-kit';
import * as readLine from "readline";

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
    const text = question + ' [' + (defaultValue ? '\x1b[36my\x1b[0m\x1b[0m|n] ' : 'y|\x1b[36mn\x1b[0m\x1b[0]] ');
    const read = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const ask = async () => {
        return new Promise<boolean>((resolve) =>
        {
            read.question(text,async (a) => {
                if(a === '' || a === null) {
                    resolve(defaultValue);
                }
                else {
                    a = a.toLowerCase();
                    if(a === 'y' || a === 'yes'){
                        resolve(true);
                    }
                    else if(a === 'n' || a === 'no'){
                        resolve(false);
                    }
                    else {
                        console.log('Please enter yes or no');
                        resolve((await ask()));
                    }
                }
            });
        });
    };
    return ask();
}