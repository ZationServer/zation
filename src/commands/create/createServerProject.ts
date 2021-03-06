import TemplateEngine from '../../shared/templateEngine';
import {checkDir, copyDirRecursive, processDestination} from '../../shared/fsUtils';
import {isWin, serverTemplateDir} from '../../shared/constants';
import {versions} from "../../versions";
import NpmRunner from "./../../shared/npmRunner";
import {askInput, yesOrNo} from '../../shared/inputHelper';
import {print} from "../../shared/consoleHelper";
import {terminal as term} from 'terminal-kit';
import {toPascalCase} from "../../shared/stringUtils";

export async function createServerProject(processDir: string, name: string, force: boolean) {

    const pascalCaseName = toPascalCase(name);

    const newFolder = await yesOrNo("Do you want to create a new project folder?",true);
    const destDir = processDestination(processDir, newFolder ? pascalCaseName : undefined);

    const description = await askInput("Enter a description",`The package ${pascalCaseName}...`);
    const author = await askInput("Enter author");
    const port = Number.parseInt(await askInput("Enter a port","3000"))?.toString();
    const git = await askInput("Enter git repository");
    print.newLine();

    const templateEngine = new TemplateEngine({
        name,
        description,
        author : author !== undefined ? `\n  "author" : "${author}", ` : '',
        port,
        git : git !== undefined ? `\n  "repository": {\n    "type": "git",\n    "url": "${git}"\n  },` : '',
        ...versions
    });

    await checkDir(destDir,newFolder,force);

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
        copyDirRecursive(serverTemplateDir,destDir);
    }
    catch (e) {
        progressBar.stop();
        print.error(`Failed to copy template files: ${e.toString()}`);
        return;
    }
    progressBar.update({progress: progress += 0.1});

    progressBar.update({title: preTitle + "Template files...", progress});

    await templateEngine.templateFiles([
        `${destDir}/src/configs/main.config.ts`,
        `${destDir}/src/configs/starter.config.ts`,
        `${destDir}/src/index.ts`,
        `${destDir}/package.json`,
        `${destDir}/Dockerfile`
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
    print.success(`Zation server app: '${name}' created in ${timeSeconds}s. 🎉`);
    print.info(`   You can start the server with the command: 'npm start'.`);
    print.info(`   But do not forget to change the directory with 'cd ${name}'.`);
    if(!isWin) {
        print.info(`   At permission error, try to start the server with sudo.`);
    }
    print.info(`   The command 'zation projectCommands' or 'zation pc' will show you more possible npm commands.`);
}