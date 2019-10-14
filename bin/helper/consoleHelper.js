/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

const VersionHelper = require("./versionHelper");
const versions      = require('./../versions');

const readLine        = require('readline');
const term            = require('terminal-kit').terminal;

class ConsoleHelper
{
    constructor() {
        this._r = readLine.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    static logErrorMessage(message)
    {
        console.log('\x1b[31m%s\x1b[0m', '   [Error]',message);
    }

    static abort()
    {
        ConsoleHelper.logWarningMessage('Aborted');
        process.exit();
    }

    static logSuccessMessage(message)
    {
        console.log('\x1b[32m%s\x1b[0m', '   [Success]',message);
    }

    static logBusyMessage(message)
    {
        console.log('\x1b[33m%s\x1b[0m','   [BUSY]',message);
    }

    static logInfoMessage(message)
    {
        console.log('\x1b[34m%s\x1b[0m','   [INFO]',message);
    }

    // noinspection JSUnusedGlobalSymbols
    static logWarningMessage(message)
    {
        console.log('\x1b[33m%s\x1b[0m', '   [Warning]',message);
    }

    static logNpmProjectCommands()
    {
        console.log();
        console.log('Npm project commands (Only works in Zation CLI created projects):');
        console.log('  For server project:');
        console.log(`     npm start                           Starts the server (and build it (only typescript)).`);
        console.log(`     npm test                            Runs all tests (and build it (only typescript)).`);
        console.log(`     npm run check                       Checks all Zation configurations.`);
        console.log(`     npm run build (only typescript)     Builds the project.`);
        console.log(`     npm run watch (only typescript)     Starts to build automatically when a file changes.`);
        console.log(`     npm run dockerBuild                 Builds an docker image.`);
        console.log(`     npm run dockerExport                Exports the docker image in the project folder.`);
        console.log(`     npm run dockerRun                   Runs docker container.`);
        console.log(`     npm run dockerStop                  Stops docker container.`);
        console.log('  For client project:');
        console.log('    Web client:');
        console.log(`       npm start                         Starts the client in the browser and build it with webpack.`);
        console.log(`       npm run build                     Builds the client with webpack.`);
        console.log('    Node client:');
        console.log(`       npm start                         Starts the client and build it.`);
        console.log(`       npm run build                     Builds the client.`);
        console.log(`       npm run watch                     Starts to build automatically when a file changes.`);
    }

    static printWelcome() {
        term.cyan('\nThank you for using the Zation Framework 🚀 (https://github.com/ZationServer)!\n');
    }

    static printVersion()
    {
        console.log(`Zation version: ${VersionHelper.getZationVersion()}`);
        console.log(`Zation Server version: ${versions["zation-server"]}`);
        console.log(`Zation Client version: ${versions["zation-client"]}`);
        console.log(`Zation Assured version: ${versions["zation-assured"]}`);
        console.log(`Zation Cluster State version: ${versions["zation-cluster-state"]}`);
        console.log(`Zation Cluster Broker version: ${versions["zation-cluster-broker"]}`);
    }

    static logFailedToRemoveDir(dirPath)
    {
        ConsoleHelper.logErrorMessage(`Failed to remove existing directory at ${dirPath}.
        This directory may be used by another program or you may not have the permission to remove it.`);
    }

    static logFailedToCreateMessage()
    {
        ConsoleHelper.logErrorMessage('Failed to init necessary files. Please check your permissions and try again.');
    }

    static logBusyInit() {
        ConsoleHelper.logBusyMessage('Init app...');
    }

    question(question, defaultValue)
    {
        return new Promise((resolve) =>
        {
            let questionTxt = '';
            if(defaultValue) {
                questionTxt = `${question} (${defaultValue}) `;
            }
            else {
                questionTxt = `${question} `;
            }

            this._r.question(questionTxt,(a) =>
            {
                if(a !== '') {
                    resolve(a);
                }
                else if(defaultValue) {
                    resolve(defaultValue);
                }
                else {
                    resolve(null);
                }
            });
        });
    }

    async yesOrNo(question,defaultIs = true) {
        let str = question + ' [';
        if(defaultIs){
            str+='\x1b[36my\x1b[0m\x1b[0m|n] ';
        }
        else {
            str+='y|\x1b[36mn\x1b[0m\x1b[0]] ';
        }

        const ask = async (text) => {
            return new Promise((resolve) =>
            {
                this._r.question(text,async (a) =>
                {
                    if(a === '' || a === null) {
                        resolve(defaultIs);
                    }
                    else {
                        a=a.toLowerCase();
                        if(a === 'y' || a === 'yes'){
                            resolve(true);
                        }
                        else if(a === 'n' || a === 'no'){
                            resolve(false);
                        }
                        else {
                            console.log('Please enter yes or no');
                            resolve((await ask(text,defaultIs)));
                        }
                    }
                });
            });
        };
        return ask(str);
    }

    static logFailedAndEnd(message) {
        ConsoleHelper.logErrorMessage(message);
        process.exit();
    }
}

module.exports = ConsoleHelper;