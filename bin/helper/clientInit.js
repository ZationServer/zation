/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

const ConsoleHelper      = require('./consoleHelper');
const EasyTemplateEngine = require('./easyTemplateEngine');
const FileSystemHelper   = require('./fileSystemHelper');
const NpmRunner          = require('./npmRunner');
const path               = require('path');
const isWindows          = require('is-windows');
const versions           = require('./../versions');
const term               = require( 'terminal-kit').terminal;

const initClientDir   = __dirname + '/templates/initClient';

class ClientInit
{
    constructor(cliDir,inPath,force)
    {
        this.cliPath = cliDir;
        this.destDir = FileSystemHelper.createDistDir(cliDir,inPath);
        this.force = force;
        this.inPath = inPath;
        this.consoleHelper = new ConsoleHelper();
        this.templateEninge = new EasyTemplateEngine();
    }

    async process()
    {
        this._startMessage();
        await this._getInformation();
        await FileSystemHelper.checkDir(this.destDir,this.consoleHelper,this.force,!!this.inPath);
        await this._init();
    }

    // noinspection JSMethodCanBeStatic
    _startMessage()
    {
        console.log();
        ConsoleHelper.logInfoMessage(`Welcome to initialize a new Zation client project`);
        console.log();
    }

    async _getInformation()
    {
        const defaultAppName = path.basename(!!this.inPath ? this.inPath : this.cliPath);

        term.cyan( 'What type of client project do you want to create?\n' );
        const type = (await term.singleColumnMenu(['Web (Creates an web client typescript project with webpack)',
                'Node (Creates an client typescript project with gulp)']).promise).selectedIndex;
        this.lowerOption = type === 0 ? 'web' : 'node';

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
        this.useDebug = await this.consoleHelper.yesOrNo('Use debug mode?',false);
        console.log('');

        this._printInformation();

        const isOk = await this.consoleHelper.yesOrNo('Is this ok?',true);
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
            this.templateEninge.addToMap('zationClientVersion',versions["zation-client"]);
            this.templateEninge.addToMap('useDebug',this.useDebug);
            this.templateEninge.addToMap('typescriptVersion',versions.typescript);
            this.templateEninge.addToMap('typescriptGulpVersion',versions["gulp-typescript"]);

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
        console.log(`Zation client version: ${versions["zation-client"]}`);
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
        EasyTemplateEngine.templateFile(`${this.destDir}/src/index.ts`,this.templateEninge);
        EasyTemplateEngine.templateFile(`${this.destDir}/package.json`,this.templateEninge);
    }

    async _init()
    {
        let startTimeStamp = Date.now();
        ConsoleHelper.logBusyInit();

        const copyDir = `${initClientDir}/${this.lowerOption}`;

        ConsoleHelper.logBusyMessage('Copy template files...');
        //abort if failed
        FileSystemHelper.copyDirRecursive(copyDir, this.destDir);
        await this._template();
        console.log();
        await NpmRunner.installDependencies(this.destDir);
        this._printSuccess(Date.now() - startTimeStamp);
    }


    _printSuccess(processTime)
    {
        console.log('');
        ConsoleHelper.logSuccessMessage(`Zation client app '${this.appName}' is created in ${(processTime / 1000).toFixed(1)}s. 🎉`);
        ConsoleHelper.logInfoMessage(`   You can start the client with the command: 'npm start'.`);
        if(!!this.inPath) {
            ConsoleHelper.logInfoMessage(`   But do not forget to change the directory with 'cd ${this.inPath}'.`);
        }
        if(!isWindows()){
            ConsoleHelper.logInfoMessage(`   At permission error, try to start the client with sudo.`);
        }
        ConsoleHelper.logInfoMessage(`   The command 'zation projectCommands' or 'zation pc' will show you more possible npm commands.`);
        process.exit();
    }
}

module.exports = ClientInit;
