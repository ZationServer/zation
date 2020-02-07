import TemplateEngine from '../../shared/templateEngine';
import { versions } from '../../versions';
import {checkDir, copyDirRecursive, processDestination} from '../../shared/fsUtils';
import { clientTemplateDir, isWin } from '../../shared/constants';
import NpmRunner from '../../shared/npmRunner';
import {askInput} from "../../shared/inputHelper";
import {print} from "../../shared/consoleHelper";
import {terminal as term} from 'terminal-kit';
import {toPascalCase} from "../../shared/stringUtils";
import {AbortedCommandError} from "../../shared/abortedCommandError";
import {Component, createComponent} from "./createComponent";

enum ClientProjectType {
    Web,
    Node
}

function getClientTemplateDir(type : ClientProjectType) : string {
    switch(type) {
        case ClientProjectType.Node:
            return clientTemplateDir + "/node";
        case ClientProjectType.Web:
            return clientTemplateDir + "/web";
    }
}

export async function createClientProject(processDir: string, name: string, force: boolean) {

    const pascalCaseName = toPascalCase(name);
    const destDir = processDestination(processDir,pascalCaseName);

    term.cyan('Which type of client project do you want to create?\n');
    const res = await term.singleColumnMenu(['Web (Creates an web client typescript project with webpack)',
        'Node (Creates an client typescript project with gulp)'],{cancelable: true}).promise;
    term("\n");
    if(res.canceled) {
        throw new AbortedCommandError();
    }
    const projectType = res.selectedIndex === 0 ? ClientProjectType.Web : ClientProjectType.Node;

    const description = await askInput("Enter a description",`The package ${pascalCaseName}...`);
    const author = await askInput("Enter author");
    const git = await askInput("Enter git repository");

    const serverHost = await askInput("Enter the server host","localhost");
    const serverPort = Number.parseInt(await askInput("Enter the server port","3000"))?.toString();
    print.newLine();

    const templateEngine = new TemplateEngine({
        name,
        description,
        author : author !== undefined ? `\n  "author" : "${author}", ` : '',
        git : git !== undefined ? `\n  "repository": {\n    "type": "git",\n    "url": "${git}"\n  },` : '',
        serverHost,
        serverPort,
        ...versions
    });

    await checkDir(destDir,force);

    const startTimeStamp = Date.now();

    const preTitle =  `Create Project: `;
    let progress = 0;
    const progressBar = term.progressBar({
        width: 80,
        title: preTitle,
        eta: true,
        percent: true,
        titleSize: 40
    });

    progressBar.update({title: preTitle + "Copy template files...", progress});
    try {
        copyDirRecursive(getClientTemplateDir(projectType),destDir);
    }
    catch (e) {
        progressBar.stop();
        print.error(`Failed to copy template files: ${e.toString()}`);
        return;
    }
    progressBar.update({progress: progress += 0.1});

    progressBar.update({title: preTitle + "Template files...", progress});

    await templateEngine.templateFiles([
        `${destDir}/src/index.ts`,
        `${destDir}/package.json`,
    ],async (i,length) => {
        progressBar.update({ progress: progress += (0.3 / length), title: preTitle + `Template file (${i}/${length})` });
    });

    progressBar.update({ title: preTitle + "Install dependencies...", progress});

    let installIncrement = 0;
    try {
        await NpmRunner.installDependencies(destDir,() => {
            if(installIncrement < 0.6){
                let addIncrement = (Math.random() * 10) / 100;
                installIncrement += addIncrement;
                if(installIncrement > 0.6) { installIncrement = 0.6 - installIncrement; }
                progressBar.update({ progress: progress += addIncrement});
            }
        });
    }
    catch(e) {
        progressBar.stop();
        print.error(`Failed to install dependencies: ${e.toString()}`);
        return;
    }

    progressBar.update({progress: 1});
    progressBar.stop();
    print.newLine();

    const timeSeconds = ((Date.now() - startTimeStamp) / 1000).toFixed(1);
    print.success(`Zation client app: '${name}' created in ${timeSeconds}s. 🎉`);
    print.info(`   You can start the client with the command: 'npm start'.`);
    print.info(`   But do not forget to change the directory with 'cd ${name}'.`);
    if(!isWin){
        print.info(`   At permission error, try to start the client with sudo.`);
    }
    print.info(`   The command 'zation projectCommands' or 'zation pc' will show you more possible npm commands.`);
}