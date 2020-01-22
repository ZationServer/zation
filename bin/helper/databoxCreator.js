/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

const ConsoleHelper      = require('./consoleHelper');
const EasyTemplateEngine = require('./easyTemplateEngine');
const FileSystemHelper   = require('./fileSystemHelper');
const path               = require('path');
const term               = require('terminal-kit').terminal;

const databoxInitFile = __dirname + '/../templates/databox/databox.ts';
const databoxFamilyInitFile = __dirname + '/../templates/databox/databoxFamily.ts';

class DataboxCreator
{
    constructor(cliDir,inPath,cTemplateDir,force)
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
        term.cyan( 'What type of databox do you want to create?\n' );
        const type = (await term.singleColumnMenu(['Databox', 'DataboxFamily']).promise).selectedIndex;
        this.dbFamily = type === 1;

        console.log();
        this.name = await this.consoleHelper.question('Name of the Databox:','MyDatabox');

        if(this.name.length < 1) {
            ConsoleHelper.logFailedAndEnd(`The name must have at least one character.`);
        }

        this.destFile = path.normalize(this.destDir + path.sep + this.name + '.ts');

        console.log('');
        this._printInformation();

        const isOk = await this.consoleHelper.yesOrNo('Create databox?',true);
        console.log('');

        if(!isOk) {
            ConsoleHelper.abort();
        }
    }

    _printInformation()
    {
        console.log('Information: ');
        console.log(`Databox Name: ${this.name}`);
        console.log(`Destination File: ${this.destFile}`);
        console.log('');
    }

    async _create()
    {
        await FileSystemHelper.checkFile(this.destDir,this.destFile,this.consoleHelper,this.force);
        ConsoleHelper.logBusyMessage('Create databox...');
        await this._createDatabox();
        this._createSuccess();
    }

    async _createDatabox()
    {
        const templateEngine = new EasyTemplateEngine();
        templateEngine.addToMap('name',this.name);
        EasyTemplateEngine.templateFromFile
        (this.dbFamily ? databoxFamilyInitFile : databoxInitFile,this.destFile,templateEngine);
    }

    // noinspection JSMethodCanBeStatic
    _createSuccess()
    {
        console.log('');
        ConsoleHelper.logSuccessMessage(`Databox: '${this.name}' is created! 🎉`);
        process.exit();
    }
}

module.exports = DataboxCreator;
