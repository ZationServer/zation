import {print} from "../../shared/consoleHelper";
import {checkFile, processDestination} from "../../shared/fsUtils";
import {terminal as term} from 'terminal-kit';
import TemplateEngine from "../../shared/templateEngine";
import * as fsExtra from "fs-extra";
import * as fs from "fs";
import {controllerTemplateFile, databoxFamilyTemplateFile, databoxTemplateFile} from "../../shared/constants";
import {toPascalCase} from "../../shared/stringUtils";

export enum Component {
    Controller,Databox,DataboxFamily
}

function getComponentTemplateFilePath(component : Component): string {
    switch(component) {
        case Component.Databox:
            return databoxTemplateFile;
        case Component.DataboxFamily:
            return databoxFamilyTemplateFile;
        case Component.Controller:
            return controllerTemplateFile;
    }
}

function getComponentName(component : Component): string {
    switch(component) {
        case Component.Databox:
            return "Databox";
        case Component.DataboxFamily:
            return "Databox";
        case Component.Controller:
            return "Controller";
    }
}

function getComponentNamePostfix(component : Component): string {
    switch(component) {
        case Component.Databox:
            return "Databox";
        case Component.DataboxFamily:
            return "DataboxFamily";
        case Component.Controller:
            return "Controller";
    }
}

export async function createComponent(componentType: Component,processDir: string,name: string,force: boolean) {
    const rawName = name;
    name = toPascalCase(name + getComponentNamePostfix(componentType));

    const destFile = processDestination(processDir,name + '.ts');

    const templateEngine = new TemplateEngine({
        name
    });

    await checkFile(destFile,force);

    const startTimeStamp = Date.now();

    const preTitle = `Create ${getComponentName(componentType)}: `;
    const progressBar = term.progressBar({
        width: 80,
        title: preTitle,
        eta: true,
        percent: true,
        titleSize: 40
    });

    progressBar.update({title: preTitle + "Copy and template file...", progress: 0});
    try {
        const templateString = fs.readFileSync(getComponentTemplateFilePath(componentType)).toString();
        fsExtra.outputFileSync(destFile,templateEngine.templateString(templateString));
    }
    catch (e) {
        progressBar.stop();
        print.error(`Failed to copy and template file: ${e.toString()}`);
        return;
    }

    progressBar.update({progress: 1});
    progressBar.stop();
    print.newLine();

    const timeSeconds = ((Date.now() - startTimeStamp) / 1000).toFixed(1);
    print.success(`${getComponentName(componentType)}: '${rawName}' created in ${timeSeconds}s. 🎉`);
}