/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

const ConsoleHelper      = require('./consoleHelper');
const EasyTemplateEngine = require('./easyTemplateEngine');
const FileHelper         = require('./fileHelper');
const emptyDir           = require('empty-dir');
const path               = require('path');
const childProcess       = require('child_process');
const spawn              = childProcess.spawn;
const fsExtra            = require('fs-extra');

class AppInit
{
    constructor(destDir,initDir,force)
    {
        this.destDir = destDir;
        this.initDir = initDir;
        this.force = force;
        this.consoleHelper = new ConsoleHelper();
        this.templateEninge = new EasyTemplateEngine();

        this.npmCommand = (process.platform === "win32" ? "npm.cmd" : "npm");
        this.npmOptions = {cwd: this.destDir, maxBuffer: Infinity};

    }

    async process()
    {
        this._startMessage();
        await this._getInformation();
        await this._checkDir();
        await this._init();
    }

    // noinspection JSMethodCanBeStatic
    _startMessage()
    {
        console.log();
        console.log(`Welcome to init a zation app`);
        console.log();
    }

    async _getInformation()
    {
        let defaultAppName = this.destDir.substring((this.destDir.lastIndexOf(path.sep)+path.sep.length));

        this.typeScript =
            (await this.consoleHelper.question
            ('Do you want to create a typescript project (better code completion)?','yes')) === 'yes';

        this.appName = await this.consoleHelper.question('App name:',defaultAppName);
        this.description = await this.consoleHelper.question('Description:','Zation application server');
        this.version = await this.consoleHelper.question('Version:','1.0.0');
        this.git = await this.consoleHelper.question('Git repository:');
        this.port = Number.parseInt(await this.consoleHelper.question('Port:',3000));
        this.timeZone = await this.consoleHelper.question('Time zone:','Europe/Berlin');
        this.license = await this.consoleHelper.question('License:','ISC');
        this.author = await this.consoleHelper.question('Author:');

        this.useDebug =
            (await this.consoleHelper.question
            ('Use debug mode?','no')) === 'yes';

        this.useStartDebug =
            (await this.consoleHelper.question
            ('Use start debug mode?','no')) === 'yes';

        console.log('');

        this._printInformation();

        let isOk = (await this.consoleHelper.question('Is this ok?','yes')) === 'yes';
        console.log();
        if(!isOk)
        {
            ConsoleHelper.abort();
        }
        else
        {
            this.templateEninge.addToMap('appName',this.appName);
            this.templateEninge.addToMap('appNameLC',this.appName.toLowerCase().trim());
            this.templateEninge.addToMap('description',this.description);
            this.templateEninge.addToMap('version',this.version);
            this.templateEninge.addToMap('port',this.port);
            this.templateEninge.addToMap('timeZone',this.timeZone );
            this.templateEninge.addToMap('license',this.license);
            this.templateEninge.addToMap('zationVersion',AppInit._getZationVersion());
            this.templateEninge.addToMap('useDebug',this.useDebug);
            this.templateEninge.addToMap('useStartDebug',this.useStartDebug);

            if(this.author !== null) {
                this.templateEninge.addToMap('author',`\n  "author" : "${this.author}", `);
            }
            else {
                this.templateEninge.addToMap('author','');
            }

            if(this.git !== null) {
                this.templateEninge.addToMap('git',`\n  "repository": {\n    "type": "git",\n    "url": "${this.git}"\n  },`);
            }
            else {
                this.templateEninge.addToMap('git','');
            }
        }
    }

    _printInformation()
    {
        console.log('Information: ');
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
        console.log('');
    }

    async _checkDir()
    {
        if(!emptyDir.sync(this.destDir))
        {
            let isOk = false;

            if(!this.force)
            {
                let message = `The folder: '${this.destDir}' is not empty. Do you want to empty it and continue?`;
                isOk = (await this.consoleHelper.question(message,'no')) === 'yes';
                console.log();
            }

            if(this.force || isOk)
            {
                console.log('empty folder...');
                try
                {
                    // noinspection JSUnresolvedFunction
                    fsExtra.emptyDirSync(this.destDir);
                }
                catch (e) {
                    ConsoleHelper.logFailedToRemoveDir(this.destDir);
                    process.exit();
                }
            }
            else {
                ConsoleHelper.abort();
            }
        }
    }

    static _getZationVersion()
    {
        let zaDir = __dirname + '/../../';
        let zaPkg = FileHelper.parsePackageFile(zaDir);
        return zaPkg.version;
    }

    static _getTypeScriptVersion()
    {
        let zaDir = __dirname + '/../../';
        let zaPkg = FileHelper.parsePackageFile(zaDir);
        return zaPkg['devDependencies']['typescript'];
    }

    async _template()
    {
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
        ConsoleHelper.logSetup();

        let copyDir = '';
        if(this.typeScript) {
            copyDir = `${this.initDir}/ts`
        }
        else {
            copyDir = `${this.initDir}/js`
        }

        if (FileHelper.copyDirRecursive(copyDir, this.destDir)) {
            await this._template();
            if(this.typeScript) {
                await this._installTypescriptGlobal();
            }
            await this._installDependencies();
            this._printSuccess(Date.now() - startTimeStamp);
        } else {
            ConsoleHelper.logFailedAndEnd();
        }
    }

    _installDependencies()
    {
        return new Promise((resolve) =>
        {
            console.log('Installing app dependencies using npm. This could take a while...');

            let npmProcess = spawn(this.npmCommand, ['install'], this.npmOptions);

            npmProcess.stdout.on('data', function (data) {
                process.stdout.write(data);
            });

            npmProcess.stderr.on('data', function (data) {
                process.stderr.write(data);
            });

            npmProcess.on('close', function (code) {
                if (code)
                {
                    ConsoleHelper.logErrorMessage(`Failed to install npm dependencies. Exited with code ${code}.`);
                    process.exit(code);
                }
                else
                {
                    resolve();
                }
            });

            npmProcess.stdin.end();
        });
    }

    _installTypescriptGlobal()
    {
        return new Promise((resolve) =>
        {
            console.log('Installing typescript global using npm. This could take a while...');

            let npmProcess =
                spawn(this.npmCommand, ['install','-g',`typescript@${AppInit._getTypeScriptVersion()}`], this.npmOptions);

            npmProcess.stdout.on('data', function (data) {
                process.stdout.write(data);
            });

            npmProcess.stderr.on('data', function (data) {
                process.stderr.write(data);
            });

            npmProcess.on('close', function (code) {
                if (code)
                {
                    ConsoleHelper.logErrorMessage(`Failed to install typescript global. Exited with code ${code}.`);
                    process.exit(code);
                }
                else
                {
                    resolve();
                }
            });

            npmProcess.stdin.end();
        });
    }

    _printSuccess(processTime)
    {
        console.log('');
        ConsoleHelper.logSuccessMessage(`Zation app '${this.appName}' is created in ${processTime}!`);
        ConsoleHelper.logInfoMessage(`   You can start the server with command: 'npm start'`);
        ConsoleHelper.logInfoMessage(`   The 'zation projectCommands' command will show you more possible npm commands`);
        process.exit();
    }
}

module.exports = AppInit;
