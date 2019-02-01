/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

const ConsoleHelper      = require('./consoleHelper');
const EasyTemplateEngine = require('./easyTemplateEngine');
const FileSystemHelper   = require('./fileSystemHelper');
const NpmRunner          = require('./npmRunner');
const path               = require('path');
const VersionManager     = require('./versionManager');
const isWindows          = require('is-windows');

class ClientInit
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

        this.zationClientVersion = VersionManager.getZationClientVersion();
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
        ConsoleHelper.logInfoMessage(`Welcome to init a zation client app`);
        console.log();
    }

    async _getInformation()
    {
        let defaultAppName = !!this.folderName ? this.folderName :
            this.cliPath.substring((this.cliPath.lastIndexOf(path.sep)+path.sep.length));

        console.log('What kind of client project do you want to create?');
        console.log('Options:');
        console.log('   Web:      Creates an web client typescript project with webpack.');
        console.log('   Node:     Creates an client typescript project with gulp.');
        console.log('   ');
        this.option = await this.consoleHelper.question('Option:','Node');
        this.lowerOption = this.option.toLowerCase();

        if(!(this.lowerOption === 'node' || this.lowerOption === 'web')) {
            ConsoleHelper.logFailedAndEnd(`The option: '${this.option}' is not valid`);
        }
        this.isNodeOption = this.lowerOption === 'node';
        this.isWebOption = this.lowerOption === 'web';

        this.appName = await this.consoleHelper.question('App name:',defaultAppName);
        this.description = await this.consoleHelper.question('Description:','Zation application client');
        this.version = await this.consoleHelper.question('Version:','1.0.0');
        this.git = await this.consoleHelper.question('Git repository:');
        this.serverHost = await this.consoleHelper.question('Server host:','localhost');
        this.serverPath = await this.consoleHelper.question('Server path:','/zation');
        this.serverPort = Number.parseInt(await this.consoleHelper.question('Server port:',3000));
        this.serverPostKey = await this.consoleHelper.question('Server post key:','zation');
        this.license = await this.consoleHelper.question('License:','ISC');
        this.author = await this.consoleHelper.question('Author:');
        this.useDebug =
            (await this.consoleHelper.question
            ('Use debug mode?','no')) === 'yes';
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
            this.templateEninge.addToMap('serverHost',this.serverHost);
            this.templateEninge.addToMap('serverPath',this.serverPath);
            this.templateEninge.addToMap('serverPort',this.serverPort);
            this.templateEninge.addToMap('serverPostKey',this.serverPostKey);
            this.templateEninge.addToMap('license',this.license);
            this.templateEninge.addToMap('zationClientVersion',this.zationClientVersion);
            this.templateEninge.addToMap('useDebug',this.useDebug);

            this.templateEninge.addToMap('author',this.author !== null ?
                `\n  "author" : "${this.author}", ` : '');

            this.templateEninge.addToMap('git',this.git !== null ?
                `\n  "repository": {\n    "type": "git",\n    "url": "${this.git}"\n  },` : '');

            this.templateEninge.addToMap('nlServerPath',this.serverPath !== '/zation' ?
                `\n        path : '${this.serverPath}', ` : '');

            this.templateEninge.addToMap('nlServerPostKey',this.serverPath !== 'zation' ?
                `\n        postKey : '${this.serverPostKey}', ` : '');

            if(this.isWebOption){
                this.templateEninge.addToMap('openCommand',isWindows() ? 'start' : 'open');
            }
        }
    }

    _printInformation()
    {
        console.log('Information: ');
        console.log(`Zation client version: ${this.zationClientVersion}`);
        console.log(`Project path: ${this.destDir}`);
        console.log(`Project type: ${this.lowerOption}`);
        console.log(`App name: ${this.appName}`);
        console.log(`Description: ${this.description}`);
        console.log(`Version: ${this.version}`);
        console.log(`Git repository: ${this.git}`);
        console.log(`Server host: ${this.serverHost}`);
        console.log(`Server path: ${this.serverPath}`);
        console.log(`Server port: ${this.serverPort}`);
        console.log(`Server post key: ${this.serverPostKey}`);
        console.log(`License: ${this.license}`);
        console.log(`Author: ${this.author}`);
        console.log(`Use debug mode: ${this.useDebug}`);
        console.log('');
    }

    async _template()
    {
        ConsoleHelper.logBusyMessage('Process template files...');

        if(this.isNodeOption || this.isWebOption) {
            EasyTemplateEngine.templateFile(`${this.destDir}/src/index.ts`,this.templateEninge);
        }

        EasyTemplateEngine.templateFile(`${this.destDir}/package.json`,this.templateEninge);
    }

    async _init()
    {
        let startTimeStamp = Date.now();
        ConsoleHelper.logBusyInit();

        const copyDir = `${this.initDir}/${this.lowerOption}`;

        ConsoleHelper.logBusyMessage('Copy template files...');
        //abort if failed
        FileSystemHelper.copyDirRecursive(copyDir, this.destDir);
        await this._template();
        await NpmRunner.installGlobal(`typescript@${VersionManager.getTypeScriptVersion()}`,this.destDir);
        console.log();
        await NpmRunner.installDependencies(this.destDir);
        this._printSuccess(Date.now() - startTimeStamp);
    }


    _printSuccess(processTime)
    {
        console.log('');
        ConsoleHelper.logSuccessMessage(`Zation client app '${this.appName}' is created in ${(processTime / 1000).toFixed(1)}s. 🎉`);
        ConsoleHelper.logInfoMessage(`   You can start the client with the command: 'npm start'.`);
        if(!!this.folderName) {
            ConsoleHelper.logInfoMessage(`   But do not forget to change the directory with 'cd ${this.folderName}'.`);
        }
        if(!isWindows()){
            ConsoleHelper.logInfoMessage(`   At permission error, try to start the client with sudo.`);
        }
        ConsoleHelper.logInfoMessage(`   The command 'zation projectCommands' or 'zation pc' will show you more possible npm commands.`);
        process.exit();
    }
}

module.exports = ClientInit;
