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

export function processDestination(processDir: string, name: string): string {
	return path.normalize(processDir + '/' + name);
}

export async function checkDir(dir: string,force: boolean) {
    if(!fs.existsSync(dir)) {
        fsExtra.ensureDirSync(dir);
    }
    if(!emptyDir.sync(dir))
    {
        let isOk = false;
        if(!force) {
            isOk = await yesOrNo
            (`There is already a directory at '${dir}'.\nDo you want to overwrite it?`,false);
            console.log();
        }
        if(force || isOk) {
            try {
                fsExtra.emptyDirSync(dir);
            }
            catch (e) {
                print.error(`Failed to remove existing directory at ${dir}.
        This directory may be used by another program or you may not have the permission to remove it.`);
                throw new AbortedCommandError(true)
            }
        }
        else {
            throw new AbortedCommandError();
        }
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

        if(force || isOk) {
            fsExtra.removeSync(destFile);
        }
        else {
            throw new AbortedCommandError();
        }
    }
    else {
        fsExtra.ensureDirSync(path.dirname(destFile));
    }
}