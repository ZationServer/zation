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
const InitDatabox      = require('./helper/initDatabox');
const GitCloner        = require('./helper/gitCloner');
const path             = require('path');
const program          = require('commander');
const term             = require( 'terminal-kit' ).terminal;
const versions         = require('./versions');

const destDir = path.normalize(process.cwd());

program
    .name('zation')
    .description('CLI tool of the Zation framework.')
    .option("-f, --force", "force all necessary directory modifications without prompt");

program.option("-v, --version", "output the version number",() => {
    ConsoleHelper.printVersion();
});

program
    .command('init [path]')
    .alias('i')
    .description('initialize a new Zation project in the working directory or a new folder')
    .action((inPath,c) => {
        term.cyan( 'What type of project do you want to create?\n' );
        term.singleColumnMenu(['Server','Client'], async ( error , response ) => {
            if( response.selectedIndex === 0){
                await new ServerInit(destDir,inPath,!!c.parent.force).process();
            }
            else {
                await new ClientInit(destDir,inPath,!!c.parent.force).process();
            }
        });
    });

program
    .command('initServer [path]')
    .alias('is')
    .description('initialize a new Zation server project in the working directory or a new folder')
    .action(async (inPath,c) => {
        await new ServerInit(destDir,inPath,!!c.parent.force).process();
    });

program
    .command('initClient [path]')
    .alias('ic')
    .description('initialize a new Zation client project in the working directory or a new folder')
    .action(async (inPath,c) => {
        await new ClientInit(destDir,inPath,!!c.parent.force).process();
    });

program
    .command('initController [path]')
    .alias('ico')
    .description('initialize a new Zation controller in the working directory')
    .action(async (inPath,c) => {
        await new InitController(destDir,inPath,!!c.parent.force).process();
    });

program
    .command('initDatabox [path]')
    .alias('ida')
    .description('initialize a new Zation databox in the working directory')
    .action(async (inPath,c) => {
        await new InitDatabox(destDir,inPath,!!c.parent.force).process();
    });

program
    .command('cloneClusterState [path]')
    .alias('ccs')
    .description('clone the zation-cluster-state package in the working directory or a new folder')
    .action(async (inPath,c) => {
        const finishedText = `   You can start the zation-cluster-state server with 'npm start'`;
        await new GitCloner
        (destDir,inPath,'direct:https://github.com/ZationServer/zation-cluster-state.git#'+versions["zation-cluster-state"],
            finishedText,!!c.parent.force).process();
    });

program
    .command('cloneClusterBroker [path]')
    .alias('ccb')
    .description('clone the zation-cluster-broker package in the working directory or a new folder')
    .action(async (inPath,c) => {
        const finishedText = `   You can start the zation-cluster-broker server with 'STATE_SERVER_HOST="localhost" node index.js'`;
        await new GitCloner
        (destDir,inPath,'direct:https://github.com/ZationServer/zation-cluster-broker.git#'+versions["zation-cluster-broker"],
            finishedText,!!c.parent.force).process();
    });

program
    .command('projectCommands')
    .alias('pc')
    .description('show all npm project commands')
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