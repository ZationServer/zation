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
    }

    async process()
    {
        await this._getInformation();
        await this._checkDir();
        await this._init();
    }

    async _getInformation()
    {
        let defaultAppName = this.destDir.substring((this.destDir.lastIndexOf(path.sep)+path.sep.length));

        this.appName = await this.consoleHelper.question('App name:',defaultAppName);
        this.description = await this.consoleHelper.question('Description:','Zation application server');
        this.version = await this.consoleHelper.question('Version:','1.0.0');
        this.git = await this.consoleHelper.question('Git repository:');
        this.port = Number.parseInt(await this.consoleHelper.question('Port:',3000));
        this.timeZone = await this.consoleHelper.question('Time zone:','Europe/Berlin');
        this.license = await this.consoleHelper.question('License:','ISC');
        this.author = await this.consoleHelper.question('Author:');

        console.log('');

        this._printInformation();

        let isOk = (await this.consoleHelper.question('Is this ok?','yes')) === 'yes';
        if(!isOk)
        {
            ConsoleHelper.abort();
        }
        else
        {
            this.templateEninge.addToMap('appName',this.appName);
            this.templateEninge.addToMap('description',this.description);
            this.templateEninge.addToMap('version',this.version);
            this.templateEninge.addToMap('port',this.port);
            this.templateEninge.addToMap('timeZone',this.timeZone );
            this.templateEninge.addToMap('license',this.license);

            if(this.author !== null) {
                this.templateEninge.addToMap('author',`"author" : "${this.author}", `);
            }
            else {
                this.templateEninge.addToMap('author','');
            }

            if(this.git !== null) {
                this.templateEninge.addToMap('git',`"repository": {\n    "type": "git",\n    "url": "${this.git}"\n  },`);
            }
            else {
                this.templateEninge.addToMap('git','');
            }
        }
    }

    _printInformation()
    {
        console.log('Information: ');
        console.log(`App name: ${this.appName}`);
        console.log(`Description: ${this.description}`);
        console.log(`Version: ${this.version}`);
        console.log(`Port: ${this.port}`);
        console.log(`Time zone: ${this.timeZone}`);
        console.log(`License: ${this.license}`);
        console.log(`Author: ${this.author}`);
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
            }

            if(this.force || isOk)
            {
                console.log('empty folder...');
                // noinspection JSUnresolvedFunction
                fsExtra.emptyDirSync(this.destDir);

                if(!emptyDir.sync(this.destDir))
                {
                    ConsoleHelper.logFailedToRemoveDir(this.destDir);
                    process.exit();
                }

            }
            else {
                ConsoleHelper.abort();
            }
        }
    }

    async _template()
    {
        EasyTemplateEngine.templateFile(`${this.destDir}/config/main.config.js`,this.templateEninge);
        EasyTemplateEngine.templateFile(`${this.destDir}/package.json`,this.templateEninge);
    }

    async _init()
    {
        ConsoleHelper.logSetup();
        if (FileHelper.copyDirRecursive(this.initDir, this.destDir)) {
            await this._template();
            this._createSuccess();
        } else {
            ConsoleHelper.logFailedAndEnd();
        }
    }

    _createSuccess()
    {
        console.log('Installing app dependencies using npm. This could take a while...');

        let npmCommand = (process.platform === "win32" ? "npm.cmd" : "npm");
        let options = {
            cwd: this.destDir,
            maxBuffer: Infinity
        };

        let npmProcess = spawn(npmCommand, ['install'], options);

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
            }
            else
            {
                console.log('');
                ConsoleHelper.logSuccessMessage('Zation app is created!');
            }
            process.exit(code);
        });

        npmProcess.stdin.end();
    }
}

module.exports = AppInit;
