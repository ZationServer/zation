/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
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

    static getZationAssuredVersion() {
        return VersionManager.getPackageJson()['dependencies']['zation-assured'];
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

    static getTypescriptGulpVersion() {
        return VersionManager.getPackageJson()['devDependencies']['gulp-typescript'];
    }

}

module.exports = VersionManager;
