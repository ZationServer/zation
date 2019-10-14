/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

const fsExtra         = require('fs-extra');
const emptyDir        = require('empty-dir');
const fs              = require('fs');
const path            = require('path');
const term            = require( 'terminal-kit').terminal;

class FileSystemHelper
{
    static fileExistsSync(filePath)
    {
        try {
            // noinspection JSUnresolvedFunction,JSUnresolvedVariable
            fsExtra.accessSync(filePath, fsExtra.constants.F_OK);
        }
        catch (err) {
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
        const ConsoleHelper = require('./consoleHelper');

        try {
            // noinspection JSUnresolvedFunction
            fsExtra.copySync(src,destination);
        }
        catch (e) {
            ConsoleHelper.logFailedToCreateMessage(`Failed to copy dir -> ${e.toString()}`);
        }
    }

    static async checkDir(destDir,consoleHelper,force,isFolderName)
    {
        const ConsoleHelper = require('./consoleHelper');

        const message = isFolderName ?
            `There is already a directory at '${destDir}'.\nDo you want to overwrite it?` :
            `The folder: '${destDir}' is not empty. Do you want to empty it and continue?`;

        if(!fs.existsSync(destDir)) {
            fsExtra.ensureDirSync(destDir);
        }

        if(!emptyDir.sync(destDir))
        {
            let isOk = false;

            if(!force) {
                isOk = await consoleHelper.yesOrNo(message,false);
                console.log();
            }

            if(force || isOk) {
                ConsoleHelper.logBusyMessage('Empty folder...');
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

    static async checkFile(destDir,destFile,consoleHelper,force) {
        if(fs.existsSync(destFile)) {
            let isOk = false;
            if(fs.lstatSync(destFile).isDirectory()) {
                if(!force) {
                    isOk = await consoleHelper.yesOrNo(`Complication with directory: '${destFile}', remove dir?`,false);
                }
            }
            else if(fs.lstatSync(destFile).isFile()) {
                if(!force) {
                    isOk = await consoleHelper.yesOrNo(`Complication with file: '${destFile}', remove file?`,false);
                }
            }

            if(force || isOk) {
                // noinspection JSUnresolvedFunction
                fsExtra.removeSync(destFile);
            }
            else {
                ConsoleHelper.abort();
            }
        }
        else {
            fsExtra.ensureDirSync(destDir);
        }
    }

    static createDistDir(cliDir,inPath) {
        return inPath ? path.normalize(cliDir + '/' + inPath) : path.normalize(cliDir)
    }

}

module.exports = FileSystemHelper;
