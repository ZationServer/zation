#!/usr/bin/env node

/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import * as path from "path";
import * as program from 'commander';
import {createServerProject} from "./commands/create/createServerProject";
import {createProject} from "./commands/create/createProject";
import {createClientProject} from "./commands/create/createClientProject";
import {print} from "./shared/consoleHelper";
import {cloneClusterComponent, ClusterComponent} from "./commands/cloneClusterComponent/cloneClusterComponent";
import {createComponent} from "./commands/create/createComponent";
import {callCommandSafe} from "./shared/commandCaller";

const processDir = path.normalize(process.cwd());

program
    .name('zation')
    .description('CLI tool of the Zation framework.')
    .option('-f --force', "force all necessary directory modifications without prompt")

program.option("-v, --version", "output the version number",() => {
    print.versions();
    process.exit(0);
});

program
    .command('create <name>')
    .alias('c')
    .description('creates a new Zation project in the working directory')
    .action(async (name) => {
        await callCommandSafe(createProject,processDir,name,program.opts()?.force);
    });

program
    .command('createServer <name>')
    .alias('cs')
    .description('creates a new Zation server project in the working directory')
    .action(async (name) => {
        await callCommandSafe(createServerProject,processDir,name,program.opts()?.force);
    });

program
    .command('createClient <name>')
    .alias('cc')
    .description('creates a new Zation client project in the working directory')
    .action(async (name) => {
        await callCommandSafe(createClientProject,processDir,name,program.opts()?.force);
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
    .action(async () => {
        await callCommandSafe(cloneClusterComponent,processDir,program.opts()?.force,ClusterComponent.State);
    });

program
    .command('cloneClusterBroker')
    .alias('ccb')
    .description('clones the zation-cluster-broker package in the working directory')
    .action(async () => {
        await callCommandSafe(cloneClusterComponent,processDir,program.opts()?.force,ClusterComponent.Broker);
    });

program
    .command('projectCommands')
    .alias('pc')
    .description('shows all project npm commands')
    .action(() => print.projectNpmCommands());

program.parse(process.argv);