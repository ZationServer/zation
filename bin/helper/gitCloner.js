/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

const ConsoleHelper      = require('./consoleHelper');
const FileSystemHelper   = require('./fileSystemHelper');
const NpmRunner          = require('./npmRunner');
const download           = require('download-git-repo');
const path               = require('path');

class GitCloner
{
    constructor(destDir,folderName,git,finishedText,force)
    {
        // noinspection DuplicatedCode
        this.destDir = folderName ? path.normalize(destDir + '/' + folderName) : path.normalize(destDir);
        this.folderName = folderName;
        this.git = git;
        this.finishedText = finishedText;
        this.force = force;
        this.consoleHelper = new ConsoleHelper();
    }

    async process() {
        console.log();
        await FileSystemHelper.checkDir(this.destDir,this.consoleHelper,this.force,!!this.folderName);
        await this._init();
    }

    async _init() {
        await this._copyRepo();
        await NpmRunner.installDependencies(this.destDir);
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
        ConsoleHelper.logBusyMessage('Clone repository...');
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
}

module.exports = GitCloner;
