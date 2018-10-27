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
    constructor(destDir,cTemplateDir,force)
    {
        this.force = force;
        this.destDir = destDir;
        this.cTemplateDir = cTemplateDir;

        this.consoleHelper = new ConsoleHelper();
    }

    async process()
    {
        await this._getInformation();
        await this._checkControllerDir();
        await this._checkConfig();
        await this._init();
    }

    // noinspection JSMethodCanBeStatic
    getAppConfigPath(str)
    {
        if(str.lastIndexOf('.js') === -1) {
            return str + `app.config.js`;
        }
        else {
            return str;
        }
    }

    async _getInformation()
    {
        this.typeScript =
            (await this.consoleHelper.question
            ('Is your project an typescript project?','yes')) === 'yes';

        let defaultAppConfigPath = '';
        let defaultControllerPath = '';
        if(this.typeScript) {
            defaultAppConfigPath = 'dist/config/app.config.js';
            defaultControllerPath = 'src/controller'
        }
        else {
            defaultAppConfigPath = 'config/app.config.js';
            defaultControllerPath = 'controller'
        }

        const appConfigPathText = `App config path ${this.typeScript ? `(compiled to javascript (run 'npm run build' before))` : ''}:`;

        this.appConfigPath
            = this.getAppConfigPath(await this.consoleHelper.question(appConfigPathText,defaultAppConfigPath));

        this.cDir = await this.consoleHelper.question('Controller directory:',defaultControllerPath);

        console.log('');
        this._printInformation();

        let isOk = (await this.consoleHelper.question('Init controller from config?','yes')) === 'yes';
        console.log('');

        if(!isOk)
        {
            ConsoleHelper.abort();
        }
    }

    _printInformation()
    {
        console.log('Information: ');
        console.log(`App config path: ${this.destDir}/${this.appConfigPath}`);
        console.log(`Controller directory: ${this.destDir}/${this.cDir}`);
        console.log('');
    }

    async _checkControllerDir()
    {
        this.fullCDir = `${this.destDir}/${this.cDir}`;

        if(fs.existsSync(this.fullCDir)) {
            if(!fs.lstatSync(this.fullCDir).isDirectory()) {
                ConsoleHelper.logFailedAndEnd(`Controller directory path: '${this.fullCDir}' is not a directory!`);
            }
        }
        else {
            ConsoleHelper.logFailedAndEnd(`Controller directory on path: '${this.fullCDir}' is not found!`);
        }
    }

    async _checkConfig()
    {
        let fullAppConfigPath = `${this.destDir}/${this.appConfigPath}`;

        if(fs.existsSync(fullAppConfigPath))
        {
            try {
                this.appConfig = require(fullAppConfigPath);
            }
            catch(e) {
                ConsoleHelper.logFailedAndEnd(`Error to require config! Error: ${e}`);
            }
        }
        else {
            ConsoleHelper.logFailedAndEnd(`App config file on path: '${fullAppConfigPath}' not found!`);
        }
    }

    async _init()
    {
        let controller = this.appConfig['controller'];
        if(controller !== undefined)
        {
            if(typeof controller === "object") {
                await this._createAllController(controller);
            }
            else {
                ConsoleHelper.logFailedAndEnd(`Value of 'controller' property is not an object!`);
            }
        }
        else {
            ConsoleHelper.logFailedAndEnd(`'controller' property does not exist!`);
        }

    }

    async _createAllController(controller)
    {
        ConsoleHelper.logBusyMessage('Create controller...');
        let createdController = [];
        for(let cName in controller)
        {
            if(controller.hasOwnProperty(cName)) {
                if(await this._createController(controller[cName],cName)) {
                    createdController.push(cName);
                }
            }
        }
        this._createSuccess(createdController);
    }

    async _createController(cConfig,cName)
    {
        let realCName = cConfig['name'] !== undefined ? cConfig['name'] : cName;
        let path      = cConfig['path'];

        let fullCPath = this._getCFullPath(realCName,path);

        if(fs.existsSync(fullCPath))
        {
            if(fs.lstatSync(fullCPath).isDirectory())
            {
                let isOk = false;

                if(!this.force) {
                    isOk = (await
                        this.consoleHelper.question(`Complication with directory: '${fullCPath}', remove dir?`,'no')) === 'yes';
                }

                if(this.force || isOk) {
                    // noinspection JSUnresolvedFunction
                    fsExtra.removeSync(fullCPath);
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }

        // noinspection JSUnresolvedFunction
        fsExtra.ensureDirSync(this._getCDirFullPath(path));
        let templateEngine = new EasyTemplateEngine();
        templateEngine.addToMap('name',this._firstLetterUpperCase(realCName));
        templateEngine.addToMap('input',this._createInputObj(cConfig));

        EasyTemplateEngine.templateFromFile
        (this.cTemplateDir + `/controller.${this.typeScript ? 'ts' : 'js'}`,fullCPath,templateEngine);

        return true;
    }

    // noinspection JSMethodCanBeStatic
    _createInputObj(config)
    {
        if(typeof config['input'] === "object")
        {
            let keys = [];
            let input = config['input'];
            for(let k in input) {
                if (input.hasOwnProperty(k))
                {
                    keys.push(k);
                }
            }
            return `{${keys.join(', ')}}`;
        }
        else {
            return '{}';
        }
    }

    // noinspection JSMethodCanBeStatic
    _firstLetterUpperCase(str)
    {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // noinspection JSMethodCanBeStatic
    _getCFullPath(name,path)
    {
        let cF = '';
        if(path === undefined) {
            cF = name;
        }
        else {
            cF = path + '/' + name;
        }

        return `${this.destDir}/${this.cDir}/${cF}.${this.typeScript ? 'ts' : 'js'}`;
    }

    _getCDirFullPath(path)
    {
        if(path === undefined) {
            return `${this.destDir}/${this.cDir}`
        }
        else {
            return `${this.destDir}/${this.cDir}/${path}`
        }
    }

    // noinspection JSMethodCanBeStatic
    _createSuccess(controllerCreated)
    {
        console.log('');
        if(controllerCreated.length === 0) {
            ConsoleHelper.logSuccessMessage
            ('No Controller was init!');
        }
        else {
            ConsoleHelper.logSuccessMessage
            (`Controller: '${controllerCreated.toString()}' ${controllerCreated.length > 1 ? 'are' : 'is'} init!`);
        }

        process.exit();
    }
}

module.exports = InitController;
