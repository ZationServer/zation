/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

const readLine = require('readline');

class ConsoleHelper
{
    constructor()
    {
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

    // noinspection JSUnusedGlobalSymbols
    static logWarningMessage(message)
    {
        console.log('\x1b[33m%s\x1b[0m', '   [Warning]',message);
    }

    static logHelp()
    {
        console.log('Usage: zation [options] [command]');
        console.log('Options:');
        console.log("  -v                Get the version of the current zation installation");
        console.log('  --help            Get info on how to use this command');
        console.log('  --force           Force all necessary directory modifications without prompts');
        console.log();
        console.log('Commands:');
        console.log(`  init              Init a new zation app in working directory`);
        console.log(`  initController    Creates zation controller from app config`);
    }

    static printLogo()
    {
        console.log('      ___           ___                                   ___           ___     ');
        console.log('     /  /\\         /  /\\          ___       ___          /  /\\         /__/\\    ');
        console.log('    /  /::|       /  /::\\        /  /\\     /  /\\        /  /::\\        \\  \\:\\   ');
        console.log('   /  /:/:|      /  /:/\\:\\      /  /:/    /  /:/       /  /:/\\:\\        \\  \\:\\  ');
        console.log('  /  /:/|:|__   /  /:/~/::\\    /  /:/    /__/::\\      /  /:/  \\:\\   _____\\__\\:\\ ');
        console.log(' /__/:/ |:| /\\ /__/:/ /:/\\:\\  /  /::\\    \\__\\/\\:\\__  /__/:/ \\__\\:\\ /__/::::::::\\');
        console.log(' \\__\\/  |:|/:/ \\  \\:\\/:/__\\/ /__/:/\\:\\      \\  \\:\\/\\ \\  \\:\\ /  /:/ \\  \\:\\~~\\~~\\/');
        console.log('     |  |:/:/   \\  \\::/      \\__\\/  \\:\\      \\__\\::/  \\  \\:\\  /:/   \\  \\:\\  ~~~ ');
        console.log('     |  |::/     \\  \\:\\           \\  \\:\\     /__/:/    \\  \\:\\/:/     \\  \\:\\     ');
        console.log('     |  |:/       \\  \\:\\           \\__\\/     \\__\\/      \\  \\::/       \\  \\:\\    ');
        console.log('     |__|/         \\__\\/                                 \\__\\/         \\__\\/    ');
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

    static logSetup()
    {
        console.log('init app...');
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
                if(a !== '')
                {
                    resolve(a);
                }
                else if(defaultValue)
                {
                    resolve(defaultValue);
                }
                else
                {
                    resolve(null);
                }
            });
        });
    }

    static logFailedAndEnd()
    {
        ConsoleHelper.logErrorMessage('Failed to init Zation app');
        process.exit();
    }
}

module.exports = ConsoleHelper;
