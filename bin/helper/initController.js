/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

const ConsoleHelper      = require('./consoleHelper');
const EasyTemplateEngine = require('./easyTemplateEngine');
const fs                 = require('fs');
const fsExtra            = require('fs-extra');

class InitController
{
    constructor(destDir,path,cTemplateDir,force)
    {
        this.force = force;
        this.destDir = destDir;
        this.path = path;
        this.cTemplateDir = cTemplateDir;

        this.consoleHelper = new ConsoleHelper();
    }

    async process()
    {
        this._processFullPath();
        await this._getInformation();
        await this._checkControllerDir();
        await this._init();
    }

    async _getInformation()
    {
        this.typeScript =
            (await this.consoleHelper.question
            ('Is your project an typescript project?','yes')) === 'yes';

        this.name =
            await this.consoleHelper.question('Name of the Controller:','MyController');

        if(this.name < 1) {
            ConsoleHelper.logFailedAndEnd(`The name must have at least one character.`);
        }

        this.name = this._firstLetterUpperCase(this.name);

        console.log('');
        this._printInformation();

        let isOk = (await this.consoleHelper.question('Init controller from config?','yes')) === 'yes';
        console.log('');

        if(!isOk)
        {
            ConsoleHelper.abort();
        }
    }

    _processFullPath()
    {
        this.fullPath = this.destDir;
        if(this.path) {
            if(!this.path.startsWith('/')) {
                this.fullPath+='/';
            }
            this.fullPath+=this.path;
            if(!this.fullPath.endsWith('/')){
                this.fullPath+='/';
            }
        }
        else {
            this.fullPath+='/';
        }
    }

    _printInformation()
    {
        console.log('Information: ');
        console.log(`Project type: ${this.typeScript ? 'typescript' : 'javascript'}`);
        console.log(`Controller Name: ${this.name}`);
        console.log(`Full Path: ${this.fullPath}${this.name}.${this.typeScript?'ts':'js'}`);
        console.log('');
    }

    async _checkControllerDir()
    {
        if(fs.existsSync(this.fullPath)) {
            if(!fs.lstatSync(this.fullPath).isDirectory()) {
                ConsoleHelper.logFailedAndEnd(`Controller directory path: '${this.fullPath}' is not a directory!`);
            }
        }
        else {
            ConsoleHelper.logFailedAndEnd(`Controller directory on path: '${this.fullPath}' is not found!`);
        }
    }

    async _init()
    {
        ConsoleHelper.logBusyMessage('Create controller...');
        await this._createController();
        this._createSuccess();
    }

    async _createController()
    {
        let fullCPath = this.fullPath + this.name + this.typeScript?'ts':'js';

        if(fs.existsSync(fullCPath))
        {
            let isOk = false;

            if(fs.lstatSync(fullCPath).isDirectory())
            {
                if(!this.force) {
                    isOk = (await
                        this.consoleHelper.question(`Complication with directory: '${fullCPath}', remove dir?`,'no')) === 'yes';
                }
            }
            else if(fs.lstatSync(fullCPath).isFile())
            {
                if(!this.force) {
                    isOk = (await
                        this.consoleHelper.question(`Complication with file: '${fullCPath}', remove file?`,'no')) === 'yes';
                }
            }

            if(this.force || isOk) {
                // noinspection JSUnresolvedFunction
                fsExtra.removeSync(fullCPath);
            }
        }

        // noinspection JSUnresolvedFunction
        fsExtra.ensureDirSync(this.fullPath);
        let templateEngine = new EasyTemplateEngine();
        templateEngine.addToMap('name',this.name);
        EasyTemplateEngine.templateFromFile
        (this.cTemplateDir + `/controller.${this.typeScript ? 'ts' : 'js'}`,fullCPath,templateEngine);
    }

    // noinspection JSMethodCanBeStatic
    _firstLetterUpperCase(str)
    {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // noinspection JSMethodCanBeStatic
    _createSuccess()
    {
        console.log('');
        ConsoleHelper.logSuccessMessage
        (`Controller: '${this.name}' is initialized!`);

        process.exit();
    }
}

module.exports = InitController;
