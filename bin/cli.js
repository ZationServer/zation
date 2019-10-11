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
const path             = require('path');
const program          = require('commander');
const term             = require( 'terminal-kit' ).terminal;

const destDir = path.normalize(process.cwd());

const initServerDir   = __dirname + '/templates/initServer';
const initClientDir   = __dirname + '/templates/initClient';
const controllerTeDir = __dirname + '/templates/controller';

program
    .name('zation')
    .description('CLI tool of the Zation framework.')
    .option("-f, --force", "force all necessary directory modifications without prompt");

program.option("-v, --version", "output the version number",() => {
    ConsoleHelper.printVersion();
});

program
    .command('init [folderName]')
    .alias('i')
    .description('initialize a new Zation project in the working directory or a new folder')
    .action((folderName,c) => {
        term.cyan( 'What type of project do you want to create?\n' );
        term.singleColumnMenu(['Server','Client'], async ( error , response ) => {
            if( response.selectedIndex === 0){
                await new ServerInit(destDir,folderName,initServerDir,!!c.parent.force).process();
            }
            else {
                await new ClientInit(destDir,folderName,initClientDir,!!c.parent.force).process();
            }
        });
    });

program
    .command('initServer [folderName]')
    .alias('is')
    .description('initialize a new Zation server project in the working directory or a new folder')
    .action(async (folderName,c) => {
        await new ServerInit(destDir,folderName,initServerDir,!!c.parent.force).process();
    });

program
    .command('initClient [folderName]')
    .alias('ic')
    .description('initialize a new Zation client project in the working directory or a new folder')
    .action(async (folderName,c) => {
        await new ClientInit(destDir,folderName,initServerDir,!!c.parent.force).process();
    });

program
    .command('initController [path]')
    .alias('ic')
    .description('initialize a new Zation controller in the working directory')
    .action(async (dirPath,c) => {
        await new InitController(destDir,dirPath,controllerTeDir,!!c.parent.force).process();
    });

program
    .command('cloneClusterState [folderName]')
    .alias('ccs')
    .description('Clone the zation-cluster-state package in the working directory or a new folder')
    .action(async (folderName,c) => {
        const finishedText = `   You can start the zation-cluster-state server with 'npm start'`;
        await new NpmPackageCopy
        (destDir,folderName,'direct:https://github.com/ZationServer/zation-cluster-state.git',finishedText,!!c.parent.force).process();
    });

program
    .command('cloneClusterBroker [folderName]')
    .alias('ccb')
    .description('Clone the zation-cluster-broker package in the working directory or a new folder')
    .action(async (folderName,c) => {
        const finishedText = `   You can start the zation-cluster-broker server with 'STATE_SERVER_HOST="localhost" node index.js'`;
        await new NpmPackageCopy
        (destDir,folderName,'direct:https://github.com/ZationServer/zation-cluster-broker.git',finishedText,!!c.parent.force).process();
    });

program
    .command('projectCommands')
    .alias('pc')
    .description('shows npm project commands')
    .action(() => ConsoleHelper.logNpmProjectCommands());

program
    .command('*','',{noHelp : true})
    .action((env) => {
        ConsoleHelper.logErrorMessage(`'${env}' is not a valid command.`);
        program.outputHelp();
    });

if (process.argv.length === 2) {
    process.argv.push('-h')
}

program.parse(process.argv);