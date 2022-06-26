/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import * as path from "path";
import * as fsExtra from "fs-extra";
import * as fs from "fs";
import * as emptyDir from "empty-dir";
import {yesOrNo} from "./inputHelper";
import {print} from "./consoleHelper";
import {AbortedCommandError} from "./abortedCommandError";

export function copyDirRecursive(source : string,destination : string) {
    fsExtra.copySync(source,destination);
}

export function processDestination(processDir: string, name?: string): string {
    if(name == null) return path.normalize(processDir);
	else return path.normalize(processDir + '/' + name);
}

export async function checkDir(dir: string,newFolder: boolean,force: boolean) {
    if(!fs.existsSync(dir))
        fsExtra.ensureDirSync(dir);
    if(!emptyDir.sync(dir))
    {
        let isOk = false;
        if(!force) {
            isOk = await yesOrNo
            (newFolder ? `There is already a directory at '${dir}'.\nDo you want to overwrite it?` :
                `The directory '${dir}' is not empty.\nDo you want to empty it?`,false);
            console.log();
        }
        if(force || isOk) {
            try {
                fsExtra.emptyDirSync(dir);
            }
            catch (e) {
                const action = newFolder ? 'remove' : 'empty';
                print.error(`Failed to ${action} existing directory at ${dir
                }.\nThis directory may be used by another program or you may not have the permission to ${action} it.`);
                throw new AbortedCommandError(true)
            }
        }
        else throw new AbortedCommandError();
    }
}

export async function checkFile(destFile: string,force: boolean) {
    if(fs.existsSync(destFile)) {
        let isOk = false;
        if(fs.lstatSync(destFile).isDirectory()) {
            if(!force) {
                isOk = await yesOrNo(`Complication with directory: '${destFile}', remove dir?`,false);
            }
        }
        else if(fs.lstatSync(destFile).isFile()) {
            if(!force) {
                isOk = await yesOrNo(`Complication with file: '${destFile}', remove file?`,false);
            }
        }

        if(force || isOk)
            fsExtra.removeSync(destFile);
        else throw new AbortedCommandError();
    }
    else fsExtra.ensureDirSync(path.dirname(destFile));
}