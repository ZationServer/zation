/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

const fsExtra       = require('fs-extra');
const ConsoleHelper = require('./consoleHelper');
const path          = require('path');
const emptyDir      = require('empty-dir');
const fs            = require('fs');

class FileSystemHelper
{
    static fileExistsSync(filePath)
    {
        try {
            // noinspection JSUnresolvedFunction,JSUnresolvedVariable
            fsExtra.accessSync(filePath, fsExtra.constants.F_OK);
        }
        catch (err)
        {
            return false;
        }
        return true;
    }

    static parsePackageFile(moduleDir)
    {
        let packageFile = moduleDir + '/package.json';
        try {
            if (FileSystemHelper.fileExistsSync(packageFile)) {
                // noinspection JSUnresolvedFunction
                return JSON.parse(fsExtra.readFileSync(packageFile, {encoding: 'utf8'}));
            }
        }
        catch (e) {}
        return {};
    }

    static copyDirRecursive(src,destination)
    {
        try {
            // noinspection JSUnresolvedFunction
            fsExtra.copySync(src,destination);
        }
        catch (e) {
            ConsoleHelper.logFailedToCreateMessage(`Failed to copy dir -> ${e.toString()}`);
        }
    }

    static async checkDir(destDir,consoleHelper,force,folderName)
    {
        let message = `The folder: '${destDir}' is not empty. Do you want to empty it and continue?`;

        if(!!folderName) {
            destDir = path.normalize(destDir + '/' + folderName);
            message = `There is already a directory at '${destDir}'. Do you want to overwrite it?`;
        }

        if(!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir);
        }

        if(!emptyDir.sync(destDir))
        {
            let isOk = false;

            if(!force) {
                isOk = (await consoleHelper.question(message,'no')) === 'yes';
                console.log();
            }

            if(force || isOk) {
                ConsoleHelper.logBusyMessage('empty folder...');
                try {
                    // noinspection JSUnresolvedFunction
                    fsExtra.emptyDirSync(destDir);
                }
                catch (e) {
                    ConsoleHelper.logFailedToRemoveDir(destDir);
                    process.exit();
                }
            }
            else {
                ConsoleHelper.abort();
            }
        }
    }
}

module.exports = FileSystemHelper;
