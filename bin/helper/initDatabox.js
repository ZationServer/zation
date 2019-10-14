/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

const ConsoleHelper      = require('./consoleHelper');
const EasyTemplateEngine = require('./easyTemplateEngine');
const FileSystemHelper   = require('./fileSystemHelper');
const path               = require('path');

const databoxInitFile = __dirname + '/templates/databox/databox.ts';
const databoxFamilyInitFile = __dirname + '/templates/databox/databoxFamily.ts';

class InitDatabox
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
        await this._init();
    }

    async _getInformation()
    {
        term.cyan( 'What type of databox do you want to create?\n' );
        const type = (await term.singleColumnMenu(['Databox', 'DataboxFamily']).promise).selectedIndex;
        this.dbFamily = type === 1;

        this.name = await this.consoleHelper.question('Name of the Databox:','MyDatabox');

        if(this.name.length < 1) {
            ConsoleHelper.logFailedAndEnd(`The name must have at least one character.`);
        }

        this.className = this._firstLetterUpperCase(this.name);

        this.destFile = path.normalize(this.destDir + path.separator + this.name + '.ts');

        console.log('');
        this._printInformation();

        const isOk = await this.consoleHelper.yesOrNo('Initialize databox?',true);
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

    async _init()
    {
        ConsoleHelper.logBusyMessage('Create databox...');
        await this._createDatabox();
        this._createSuccess();
    }

    async _createDatabox()
    {
        await FileSystemHelper.checkFile(this.destDir,this.destFile,this.consoleHelper,this.force);
        const templateEngine = new EasyTemplateEngine();
        templateEngine.addToMap('name',this.name);
        templateEngine.addToMap('className',this.className);
        EasyTemplateEngine.templateFromFile
        (this.dbFamily ? databoxFamilyInitFile : databoxInitFile,this.destFile,templateEngine);
    }

    // noinspection JSMethodCanBeStatic
    _firstLetterUpperCase(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // noinspection JSMethodCanBeStatic
    _createSuccess()
    {
        console.log('');
        ConsoleHelper.logSuccessMessage(`Databox: '${this.name}' is initialized! 🎉`);
        process.exit();
    }
}

module.exports = InitDatabox;
