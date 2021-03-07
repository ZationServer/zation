#!/usr/bin/env node

/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import * as path from "path";
import * as program from 'commander';
import {createServerProject} from "./commands/create/createServerProject";
import {createProject} from "./commands/create/createProject";
import {createClientProject} from "./commands/create/createClientProject";
import {print} from "./shared/consoleHelper";
import {cloneClusterComponent, ClusterComponent} from "./commands/cloneClusterComponent/cloneClusterComponent";
import {Component, createComponent} from "./commands/create/createComponent";
import {createDatabox} from "./commands/create/createDatabox";
import {callCommandSafe} from "./shared/commandCaller";

const processDir = path.normalize(process.cwd());

program
    .name('zation')
    .description('CLI tool of the Zation framework.')
    .option("-f, --force", "force all necessary directory modifications without prompt");

program.option("-v, --version", "output the version number",() => {
    print.versions();
});

program
    .command('create <name>')
    .alias('c')
    .description('creates a new Zation project in the working directory')
    .action(async (name,c) => {
        await callCommandSafe(createProject,processDir,name,c.parent.force);
    });

program
    .command('createServer <name>')
    .alias('cs')
    .description('creates a new Zation server project in the working directory')
    .action(async (name,c) => {
        await callCommandSafe(createServerProject,processDir,name,c.parent.force);
    });

program
    .command('createClient <name>')
    .alias('cc')
    .description('creates a new Zation client project in the working directory')
    .action(async (name,c) => {
        await callCommandSafe(createClientProject,processDir,name,c.parent.force);
    });

program
    .command('createComponent <name>')
    .alias('cco')
    .description('creates a new Zation component in the working directory')
    .action(async (name) => {
        await callCommandSafe(createComponent,processDir,name,program.opts()?.force);
    });

program
    .command('cloneClusterState')
    .alias('ccs')
    .description('clones the zation-cluster-state package in the working directory')
    .action(async (c) => {
        await callCommandSafe(cloneClusterComponent,processDir,c.parent.force,ClusterComponent.State);
    });

program
    .command('cloneClusterBroker')
    .alias('ccb')
    .description('clones the zation-cluster-broker package in the working directory')
    .action(async (name,c) => {
        await callCommandSafe(cloneClusterComponent,processDir,c.parent.force,ClusterComponent.Broker);
    });

program
    .command('projectCommands')
    .alias('pc')
    .description('shows all project npm commands')
    .action(() => print.projectNpmCommands());

program
    .command('*','',{noHelp : true})
    .action((env) => {
        print.error(`'${env}' is not a valid command.`);
        program.outputHelp();
    });

if (process.argv.length === 2) {
    process.argv.push('-h')
}

program.parse(process.argv);