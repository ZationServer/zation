/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

const ConsoleHelper      = require('./consoleHelper');
const emptyDir           = require('empty-dir');
const childProcess       = require('child_process');
const spawn              = childProcess.spawn;
const exec               = childProcess.exec;
const fsExtra            = require('fs-extra');
const fs                 = require('fs');
const globalDirs         = require('global-dirs');
const isPathInside       = require('is-path-inside');

class NpmPackageCopy
{
    constructor(destDir,npmModuleName,finishedText,force)
    {
        this.destDir = destDir;
        this.npmPackageName = npmModuleName;
        this.finishedText = finishedText;
        this.force = force;
        this.consoleHelper = new ConsoleHelper();

        this.npmCommand = (process.platform === "win32" ? "npm.cmd" : "npm");
        this.npmOptions = {cwd: this.destDir, maxBuffer: Infinity};
    }

    async process() {
        await this._checkDir();
        await this._init();
    }

    async _checkDir()
    {
        if(!emptyDir.sync(this.destDir)) {
            let isOk = false;

            if (!this.force) {
                let message = `The folder: '${this.destDir}' is not empty. Do you want to empty it and continue?`;
                isOk = (await this.consoleHelper.question(message, 'no')) === 'yes';
                console.log();
            }

            if (this.force || isOk) {
                console.log('empty folder...');
                try {
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
        await this._installNpmClone();
        await this._installModule();
        this._printSuccess();
    }

    _installModule()
    {
        return new Promise((resolve) =>
        {
            console.log(`Clone npm package '${this.npmPackageName}' and install dependencies. This could take a while...`);

            let npmProcess = exec(`npm-clone install ${this.npmPackageName}`);

            npmProcess.stdout.on('data', function (data) {
                process.stdout.write(data);
            });

            npmProcess.stderr.on('data', function (data) {
                process.stderr.write(data);
            });

            npmProcess.on('close', (code) => {
                if (code) {
                    ConsoleHelper.logErrorMessage(`Failed to copy package '${this.npmPackageName}' and install npm dependencies. Exited with code ${code}.`);
                    process.exit(code);
                }
                else {
                    resolve();
                }
            });
            npmProcess.stdin.end();
        });
    }

    // noinspection JSMethodCanBeStatic
    _checkNpmCopyInstalled(npmModuleName) {
        return isPathInside(npmModuleName, globalDirs['yarn']['packages']) ||
            isPathInside(npmModuleName, fs.realpathSync(globalDirs['npm']['packages']));
    }

    _installNpmClone()
    {
        return new Promise((resolve) =>
        {
            if(!this._checkNpmCopyInstalled('npm-clone')) {
                console.log('Installing npm-clone global using npm...');

                let npmProcess =
                    spawn(this.npmCommand, ['install','-g','npm-clone'], this.npmOptions);

                npmProcess.stdout.on('data', function (data) {
                    process.stdout.write(data);
                });

                npmProcess.stderr.on('data', function (data) {
                    process.stderr.write(data);
                });

                npmProcess.on('close', function (code) {
                    if (code) {
                        ConsoleHelper.logErrorMessage(`Failed to install npm-clone global. Exited with code ${code}.`);
                        process.exit(code);
                    }
                    else {
                        resolve();
                    }
                });
                npmProcess.stdin.end();
            }
        });
    }

    _printSuccess()
    {
        console.log('');
        ConsoleHelper.logSuccessMessage(`Npm package ${this.npmPackageName} is cloned!`);
        ConsoleHelper.logInfoMessage(`   ${this.finishedText}`);
        process.exit();
    }
}

module.exports = NpmPackageCopy;
