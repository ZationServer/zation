/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

const FileSystemHelper   = require('./fileSystemHelper');

class VersionHelper
{
    static getPackageJson() {
        const zaDir = __dirname + '/../../';
        return FileSystemHelper.parsePackageFile(zaDir);
    }

    static getZationVersion() {
        return VersionHelper.getPackageJson().version;
    }
}

module.exports = VersionHelper;