/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {print} from "../shared/consoleHelper";
import {checkFile, processDestination} from "../shared/fsUtils";
import {terminal as term} from 'terminal-kit';
import TemplateEngine from "../shared/templateEngine";
import * as fsExtra from "fs-extra";
import * as fs from "fs";
import * as path from "path";
import {componentsTemplateDir} from "../shared/constants";
import {toPascalCase} from "../shared/stringUtils";
import {AbortedCommandError} from "../shared/abortedCommandError";

export enum ComponentType {
    Controller,
    Receiver,
    Databox,
    StaticDatabox,
    Channel,
    StaticChannel
}

const COMPONENT_NAMES = Object.keys(ComponentType).reduce((a: string[],v) => {
    if(isNaN(parseInt(v))) a.push(v);
    return a;
},[]);

const COMPONENT_TEMPLATE_MAP: Record<ComponentType,string> = {
    [ComponentType.Controller]: 'controller',
    [ComponentType.Receiver]: 'receiver',
    [ComponentType.Databox]: 'databox',
    [ComponentType.StaticDatabox]: 'staticDatabox',
    [ComponentType.Channel]: 'channel',
    [ComponentType.StaticChannel]: 'staticChannel'
};

export async function createComponent(processDir: string,name: string,force: boolean) {

    term.cyan('Which type of component do you want to create?\n');
    const res = await term.singleColumnMenu(COMPONENT_NAMES,{cancelable: true}).promise;
    term("\n");
    if(res.canceled) throw new AbortedCommandError();

    const selectedType = res.selectedText;
    const type: ComponentType = ComponentType[selectedType];

    const rawName = name;
    name = toPascalCase(name);

    const destFile = processDestination(processDir,name + '.ts');

    const templateEngine = new TemplateEngine({name});

    await checkFile(destFile,force);

    const startTimeStamp = Date.now();

    const preTitle = `Create ${selectedType}: `;
    const progressBar = term.progressBar({
        width: 80,
        title: preTitle,
        eta: true,
        percent: true,
        titleSize: 40
    });

    progressBar.update({title: preTitle + "Copy and template file...", progress: 0});
    try {
        const templateString = fs.readFileSync(path.join(componentsTemplateDir,
            COMPONENT_TEMPLATE_MAP[type] + '.ts')).toString();
        fsExtra.outputFileSync(destFile,templateEngine.templateString(templateString));
    }
    catch (e: any) {
        progressBar.stop();
        print.error(`Failed to copy and template file: ${e.toString()}`);
        return;
    }

    progressBar.update({progress: 1});
    progressBar.stop();
    print.newLine();

    const timeSeconds = ((Date.now() - startTimeStamp) / 1000).toFixed(1);
    print.success(`${selectedType}: '${rawName}' created in ${timeSeconds}s. 🎉`);
}