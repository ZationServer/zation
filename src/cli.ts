#!/usr/bin/env node

/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import * as path from "path";
import {program} from 'commander';
import {createServerProject} from "./commands/createServerProject";
import {createProject} from "./commands/createProject";
import {createClientProject} from "./commands/createClientProject";
import {print} from "./shared/consoleHelper";
import {createComponent} from "./commands/createComponent";
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

program.parse(process.argv);