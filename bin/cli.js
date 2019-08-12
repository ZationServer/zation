#!/usr/bin/env node

/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

const ConsoleHelper    = require('./helper/consoleHelper');
const ServerInit       = require('./helper/serverInit');
const ClientInit       = require('./helper/clientInit');
const InitController   = require('./helper/initController');
const NpmPackageCopy   = require('./helper/npmPackageCopy');

const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const command = argv._[0];
const arg1 = argv._[1];
const force = argv['force'];

const initServerDir   = __dirname + '/templates/initServer';
const initClientDir   = __dirname + '/templates/initClient';
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
    ConsoleHelper.printVersion();
    process.exit();
}

if (command === 'initServer' || command === 'is') {
    (async () =>
    {
        await new ServerInit(destDir,arg1,initServerDir,force).process();
    })();
}
else if (command === 'initClient' || command === 'ic') {
    (async () =>
    {
        await new ClientInit(destDir,arg1,initClientDir,force).process();
    })();
}
else if (command === 'initController' || command === 'ico') {
    (async () =>
    {
        await new InitController(destDir,arg1,controllerTeDir,force).process();
    })();
}
else if (command === 'projectCommands' || command === 'pc') {
    ConsoleHelper.logNpmProjectCommands();
    process.exit();
}
else if (command === 'cloneClusterState' || command === 'ccs') {
    (async () =>
    {
        let finishedText = `   You can start the zation-cluster-state server with 'npm start'`;
        await new NpmPackageCopy
        (destDir,arg1,'direct:https://github.com/ZationServer/zation-cluster-state.git',finishedText,force).process();
        process.exit();
    })();
}
else if (command === 'cloneClusterBroker' || command === 'ccb') {
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
    ConsoleHelper.logErrorMessage(`'${command}' is not a valid Zation command.`);
    ConsoleHelper.logHelp();
    process.exit();
}

