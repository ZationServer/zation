/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

const ConsoleHelper      = require('./consoleHelper');
const emptyDir           = require('empty-dir');
const childProcess       = require('child_process');
const spawn              = childProcess.spawn;
const download           = require('download-git-repo');
const fsExtra            = require('fs-extra');
const path               = require('path');
const fs                 = require('fs');

class NpmPackageCopy
{
    constructor(destDir,folderName,git,finishedText,force)
    {
        this.destDir = destDir;
        this.folderName = folderName;
        this.git = git;
        this.finishedText = finishedText;
        this.force = force;
        this.consoleHelper = new ConsoleHelper();

        this.npmCommand = (process.platform === "win32" ? "npm.cmd" : "npm");
    }

    async process() {
        console.log();
        await this._checkDir();
        await this._init();
    }

    async _checkDir()
    {
        let message = `The folder: '${this.destDir}' is not empty. Do you want to empty it and continue?`;

        if(!!this.folderName) {
            this.destDir = path.normalize(this.destDir + '/' + this.folderName);
            message = `There is already a directory at '${this.destDir}'. Do you want to overwrite it?`;
        }

        if(!fs.existsSync(this.destDir)) {
            fs.mkdirSync(this.destDir);
        }

        if(!emptyDir.sync(this.destDir))
        {
            let isOk = false;

            if(!this.force)
            {
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

    async _init() {
        await this._copyRepo();
        await this._installDependencies();
        this.successPrint();
        process.exit();
    }

    successPrint() {
        ConsoleHelper.logSuccessMessage('Git repository was successfully cloned!');
        ConsoleHelper.logInfoMessage(this.finishedText);
        if(!!this.folderName) {
            ConsoleHelper.logInfoMessage(`   But do not forget to change the directory with 'cd ${this.folderName}'`);
        }
        ConsoleHelper.logInfoMessage(`   At permission error, try to start the server with sudo`);
    }

    _copyRepo()
    {
        console.log('Clone repository...');
        console.log();
        return new Promise((resolve) => {
            download(this.git,this.destDir, { clone: true }, (err) => {
                if(err) {
                    ConsoleHelper.logFailedAndEnd('Error by cloning git repository!');
                }
                resolve();
            })
        });
    }

    _installDependencies()
    {
        return new Promise((resolve) =>
        {
            console.log('Installing app dependencies using npm. This could take a while...');

            let npmProcess = spawn(this.npmCommand, ['install'], {cwd: this.destDir, maxBuffer: Infinity});

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
}

module.exports = NpmPackageCopy;
