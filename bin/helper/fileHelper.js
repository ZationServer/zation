/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

const fsExtra       = require('fs-extra');
const ConsoleHelper = require('./consoleHelper');

class FileHelper
{
    static fileExistsSync(filePath)
    {
        try
        {
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
        try
        {
            if (FileHelper.fileExistsSync(packageFile))
            {
                // noinspection JSUnresolvedFunction
                return JSON.parse(fsExtra.readFileSync(packageFile, {encoding: 'utf8'}));
            }
        }
        catch (e) {}
        return {};
    }

    static copyDirRecursive(src,destination)
    {
        try
        {
            // noinspection JSUnresolvedFunction
            fsExtra.copySync(src,destination);
            return true;
        }
        catch (e)
        {
            ConsoleHelper.logFailedToCreateMessage();
        }
        return false;
    }
}

module.exports = FileHelper;
