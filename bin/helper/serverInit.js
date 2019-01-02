/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

const ConsoleHelper      = require('./consoleHelper');
const EasyTemplateEngine = require('./easyTemplateEngine');
const FileSystemHelper   = require('./fileSystemHelper');
const VersionManager     = require('./versionManager');
const NpmRunner          = require('./npmRunner');
const path               = require('path');
const isWindows          = require('is-windows');

class ServerInit
{
    constructor(cliDir,folderName,initDir,force)
    {
        this.cliPath = cliDir;
        this.destDir = folderName ?
            path.normalize(cliDir + '/' + folderName) :
            path.normalize(cliDir);
        this.initDir = initDir;
        this.force = force;
        this.folderName = folderName;
        this.consoleHelper = new ConsoleHelper();
        this.templateEninge = new EasyTemplateEngine();

        this.zationServerVersion = VersionManager.getZationServerVersion();
    }

    async process()
    {
        this._startMessage();
        await this._getInformation();
        await FileSystemHelper.checkDir(this.destDir,this.consoleHelper,this.force,!!this.folderName);
        await this._init();
    }

    // noinspection JSMethodCanBeStatic
    _startMessage()
    {
        console.log();
        ConsoleHelper.logInfoMessage(`Welcome to init a zation server app`);
        console.log();
    }

    async _getInformation()
    {
        let defaultAppName = !!this.folderName ? this.folderName :
            this.cliPath.substring((this.cliPath.lastIndexOf(path.sep)+path.sep.length));

        this.typeScript =
            (await this.consoleHelper.question
            ('Do you want to create a typescript project (better code completion and recommend)?','yes')) === 'yes';

        this.appName = await this.consoleHelper.question('App name:',defaultAppName);
        this.description = await this.consoleHelper.question('Description:','Zation application server');
        this.version = await this.consoleHelper.question('Version:','1.0.0');
        this.git = await this.consoleHelper.question('Git repository:');
        this.port = Number.parseInt(await this.consoleHelper.question('Port:',3000));
        this.timeZone = await this.consoleHelper.question('Time zone:');
        this.license = await this.consoleHelper.question('License:','ISC');
        this.author = await this.consoleHelper.question('Author:');

        this.useDebug =
            (await this.consoleHelper.question
            ('Use debug mode?','yes')) === 'yes';

        this.useStartDebug =
            (await this.consoleHelper.question
            ('Use start debug mode?','no')) === 'yes';

        this.panelUserName = await this.consoleHelper.question('Panel user name:','admin');
        this.panelPassword = await this.consoleHelper.question('Panel password:','admin');

        console.log('');

        this._printInformation();

        let isOk = (await this.consoleHelper.question('Is this ok?','yes')) === 'yes';
        console.log();
        if(!isOk) {
            ConsoleHelper.abort();
        }
        else {
            this.templateEninge.addToMap('appName',this.appName);
            this.templateEninge.addToMap('appNameLC',this.appName.toLowerCase().trim());
            this.templateEninge.addToMap('description',this.description);
            this.templateEninge.addToMap('version',this.version);
            this.templateEninge.addToMap('port',this.port);
            this.templateEninge.addToMap('timeZone',this.timeZone );
            this.templateEninge.addToMap('license',this.license);
            this.templateEninge.addToMap('zationServerVersion',this.zationServerVersion);
            this.templateEninge.addToMap('useDebug',this.useDebug);
            this.templateEninge.addToMap('useStartDebug',this.useStartDebug);
            this.templateEninge.addToMap('panelUserName',this.panelUserName);
            this.templateEninge.addToMap('panelPassword',this.panelPassword);

            this.templateEninge.addToMap('author',this.author !== null ?
                `\n  "author" : "${this.author}", ` : '');

            this.templateEninge.addToMap('timeZone',this.timeZone ?
                `\n        timeZone : "${this.timeZone}", `: '');

            this.templateEninge.addToMap('git',this.git !== null ?
                `\n  "repository": {\n    "type": "git",\n    "url": "${this.git}"\n  },` : '');

        }
    }

    _printInformation()
    {
        console.log('Information: ');
        console.log(`Zation server version: ${this.zationServerVersion}`);
        console.log(`Project path: ${this.destDir}`);
        console.log(`Project type: ${this.typeScript ? 'typescript' : 'javascript'}`);
        console.log(`App name: ${this.appName}`);
        console.log(`Description: ${this.description}`);
        console.log(`Version: ${this.version}`);
        console.log(`Git repository: ${this.git}`);
        console.log(`Port: ${this.port}`);
        console.log(`Time zone: ${this.timeZone}`);
        console.log(`License: ${this.license}`);
        console.log(`Author: ${this.author}`);
        console.log(`Use debug mode: ${this.useDebug}`);
        console.log(`Use start debug mode: ${this.useStartDebug}`);
        console.log(`Panel user name: ${this.panelUserName}`);
        console.log(`Panel password: ${this.panelPassword}`);
        console.log('');
    }

    async _template()
    {
        ConsoleHelper.logBusyMessage('Process template files...');
        const jsMainConfig = `${this.destDir}/config/main.config.js`;
        const tsMainConfig = `${this.destDir}/src/config/main.config.ts`;
        EasyTemplateEngine.templateFile(this.typeScript ? tsMainConfig : jsMainConfig,this.templateEninge);

        const jsIndex = `${this.destDir}/index.js`;
        const tsIndex = `${this.destDir}/src/index.ts`;
        EasyTemplateEngine.templateFile(this.typeScript ? tsIndex : jsIndex,this.templateEninge);

        EasyTemplateEngine.templateFile(`${this.destDir}/package.json`,this.templateEninge);

        EasyTemplateEngine.templateFile(`${this.destDir}/Dockerfile`,this.templateEninge);
    }

    async _init()
    {
        let startTimeStamp = Date.now();
        ConsoleHelper.logBusyInit();

        let copyDir = '';
        if(this.typeScript) {
            copyDir = `${this.initDir}/ts`
        }
        else {
            copyDir = `${this.initDir}/js`
        }

        ConsoleHelper.logBusyMessage('Copy template files...');
        //abort if failed
        FileSystemHelper.copyDirRecursive(copyDir, this.destDir);
        await this._template();
        if(this.typeScript) {
            await NpmRunner.installGlobal(`typescript@${VersionManager.getTypeScriptVersion()}`,this.destDir);
        }
        await NpmRunner.installDependencies(this.destDir);
        this._printSuccess(Date.now() - startTimeStamp);
    }


    _printSuccess(processTime)
    {
        console.log('');
        ConsoleHelper.logSuccessMessage(`Zation server app '${this.appName}' is created in ${(processTime / 1000).toFixed(1)}s.`);
        ConsoleHelper.logInfoMessage(`   You can start the server with the command: 'npm start'.`);
        if(!!this.folderName) {
            ConsoleHelper.logInfoMessage(`   But do not forget to change the directory with 'cd ${this.folderName}'.`);
        }
        if(!isWindows()) {
            ConsoleHelper.logInfoMessage(`   At permission error, try to start the server with sudo.`);
        }
        ConsoleHelper.logInfoMessage(`   The command 'zation projectCommands' or 'zation pc' will show you more possible npm commands.`);
        process.exit();
    }
}

module.exports = ServerInit;
