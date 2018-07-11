#!/usr/bin/env node

/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

const ConsoleHelper    = require('./helper/consoleHelper');
const FileHelper       = require('./helper/fileHelper');
const AppInit          = require('./helper/appInit');
const InitController   = require('./helper/initController');

const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const command = argv._[0];
const force = argv['force'];

const initTeDir       = __dirname + '/templates/init';
const controllerTeDir = __dirname + '/templates/controller';

const destDir = path.normalize(process.cwd());


//Actions
if (argv['help'])
{
    ConsoleHelper.logHelp();
    process.exit();
}

if (argv['v'])
{
    let zaDir = __dirname + '/../';
    let zaPkg = FileHelper.parsePackageFile(zaDir);
    console.log('v' + zaPkg.version);
    process.exit();
}

if (command === 'init')
{
    (async () =>
    {
        await new AppInit(destDir,initTeDir,force).process();
    })();
}
else if (command === 'initController')
{
    (async () =>
    {
        await new InitController(destDir,controllerTeDir,force).process();
    })();
}
else if(command === 'welcome')
{
    ConsoleHelper.printLogo();
    console.log('                                THANKS FOR USING');
    console.log('');
}
else
{
    ConsoleHelper.logErrorMessage(`'${command} is not a valid Zation command.'`);
    ConsoleHelper.logHelp();
    process.exit();
}

