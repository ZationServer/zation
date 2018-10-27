/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

const FileSystemHelper   = require('./fileSystemHelper');

class VersionManager
{

    static getPackageJson() {
        const zaDir = __dirname + '/../../';
        return FileSystemHelper.parsePackageFile(zaDir);
    }

    static getZationServerVersion() {
        return VersionManager.getPackageJson()['dependencies']['zation-server'];
    }

    static getZationVersion() {
        return VersionManager.getPackageJson().version;
    }

    static getTypeScriptVersion() {
        return VersionManager.getPackageJson()['devDependencies']['typescript'];
    }

    static getZationClientVersion() {
        return VersionManager.getPackageJson()['dependencies']['zation-client'];
    }

}

module.exports = VersionManager;