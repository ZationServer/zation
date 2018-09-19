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
const NpmPackageCopy   = require('./helper/npmPackageCopy');

const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const command = argv._[0];
const arg1 = argv._[1];
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

if (argv['v'] || argv['version'])
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
        await new AppInit(destDir,arg1,initTeDir,force).process();
    })();
}
else if (command === 'initController')
{
    (async () =>
    {
        await new InitController(destDir,controllerTeDir,force).process();
    })();
}
else if (command === 'projectCommands')
{
    ConsoleHelper.logNpmProjectCommands();
    process.exit();
}
else if (command === 'cloneClusterState')
{
    (async () =>
    {
        let finishedText = `   You can start the zation-cluster-state server with 'npm start'`;
        await new NpmPackageCopy
        (destDir,arg1,'direct:https://github.com/ZationServer/zation-cluster-state.git',finishedText,force).process();
        process.exit();
    })();
}
else if (command === 'cloneClusterBroker')
{
    (async () =>
    {
        let finishedText = `   You can start the zation-cluster-broker server with 'STATE_SERVER_HOST="localhost" node index.js'`;
        await new NpmPackageCopy
        (destDir,arg1,'direct:https://github.com/ZationServer/zation-cluster-broker.git',finishedText,force).process();
        process.exit();
    })();
}
else if(!command)
{
    ConsoleHelper.logHelp();
    process.exit();
}
else
{
    console.log();
    ConsoleHelper.logErrorMessage(`'${command} is not a valid Zation command.'`);
    ConsoleHelper.logHelp();
    process.exit();
}

