/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

const ConsoleHelper      = require('./consoleHelper');
const EasyTemplateEngine = require('./easyTemplateEngine');
const FileSystemHelper   = require('./fileSystemHelper');
const path               = require('path');

const controllerInitFile = __dirname + '/../templates/controller/controller.ts';

class ControllerCreator
{
    constructor(cliDir,inPath,force)
    {
        this.force = force;
        this.destDir = FileSystemHelper.createDistDir(cliDir,inPath);
        this.consoleHelper = new ConsoleHelper();
    }

    async process()
    {
        await this._getInformation();
        await this._create();
    }

    async _getInformation()
    {
        this.name = await this.consoleHelper.question('Name of the Controller:','MyController');

        if(this.name.length < 1) {
            ConsoleHelper.logFailedAndEnd(`The name must have at least one character.`);
        }

        this.destFile = path.normalize(this.destDir + path.sep + this.name + '.ts');

        console.log('');
        this._printInformation();

        const isOk = await this.consoleHelper.yesOrNo('Create controller?',true);
        console.log('');

        if(!isOk) {
            ConsoleHelper.abort();
        }
    }

    _printInformation()
    {
        console.log('Information: ');
        console.log(`Controller Name: ${this.name}`);
        console.log(`Destination File: ${this.destFile}`);
        console.log('');
    }

    async _create()
    {
        await FileSystemHelper.checkFile(this.destDir,this.destFile,this.consoleHelper,this.force);
        ConsoleHelper.logBusyMessage('Create controller...');
        await this._createController();
        this._createSuccess();
    }

    async _createController()
    {
        const templateEngine = new EasyTemplateEngine();
        templateEngine.addToMap('name',this.name);
        EasyTemplateEngine.templateFromFile
        (controllerInitFile,this.destFile,templateEngine);
    }

    // noinspection JSMethodCanBeStatic
    _createSuccess()
    {
        console.log('');
        ConsoleHelper.logSuccessMessage(`Controller: '${this.name}' is created! 🎉`);
        process.exit();
    }
}

module.exports = ControllerCreator;
