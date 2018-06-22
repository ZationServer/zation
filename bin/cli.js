#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const childProcess = require('child_process');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const spawn = childProcess.spawn;

let command = argv._[0];
let arg1 = argv._[1];
let force = !!argv['force'];

let wd = process.cwd();
let sampleDir = __dirname + '/../sample';
let destDir = path.normalize(wd + '/' + arg1);

class FileHelper
{
    static fileExistsSync(filePath)
    {
        try
        {
            // noinspection JSUnresolvedFunction,JSUnresolvedVariable
            fs.accessSync(filePath, fs.constants.F_OK);
        }
        catch (err)
        {
            return false;
        }
        return true;
    }

    static parsePackageFile(moduleDir)
    {
        let packageFile = moduleDir + '/package.json';
        try
        {
            if (FileHelper.fileExistsSync(packageFile))
            {
                // noinspection JSUnresolvedFunction
                return JSON.parse(fs.readFileSync(packageFile, {encoding: 'utf8'}));
            }
        }
        catch (e) {}
        return {};
    }

    static copyDirRecursive(src,destination)
    {
        try
        {
            // noinspection JSUnresolvedFunction
            fs.copySync(src,destination);
            return true;
        }
        catch (e)
        {
            ConsoleHelper.logFailedToCreateMessage();
        }
        return false;
    }

    static removeDirRecursive(dir)
    {
        try
        {
            // noinspection JSUnresolvedFunction
            fs.removeSync(dir);
            return true;
        }
        catch (e)
        {
            ConsoleHelper.logFailedToRemoveDir(dir);
        }
        return false;
    }
}

class ConsoleHelper
{
    static logErrorMessage(message)
    {
        console.log('\033[0;31m[Error]\033[0m ' + message);
    }

    static logSuccessMessage(message)
    {
        console.log('\033[0;32m[Success]\033[0m ' + message);
    }

    // noinspection JSUnusedGlobalSymbols
    static logWarningMessage(message)
    {
        console.log('\033[0;33m[Warning]\033[0m ' + message);
    }

    static logHelp()
    {
        console.log('Usage: zation [options] [command]\n');
        console.log('Options:');
        console.log("  -v            Get the version of the current zation installation");
        console.log('  --help        Get info on how to use this command');
        console.log('  --force       Force all necessary directory modifications without prompts');
        console.log();
        console.log('Commands:');
        console.log(`  create [appname]  Create a new boilerplate app in working directory`);
    }

    static logFailedToRemoveDir(dirPath)
    {
        ConsoleHelper.logErrorMessage(`Failed to remove existing directory at ${dirPath}.
        This directory may be used by another program or you may not have the permission to remove it.`);
    }

    static logFailedToCreateMessage()
    {
        ConsoleHelper.logErrorMessage('Failed to create necessary files. Please check your permissions and try again.');
    }

    static logSetup()
    {
        console.log('Creating app...');
    }

    static promptConfirm(message)
    {
        return new Promise((resolve)=>
        {
            prompt([
                {
                    type: 'confirm',
                    message: message,
                    name: 'result'
                }
            ])
                .then((answers) =>
            {
                resolve(answers.result);
            })
                .catch((err) => {
                ConsoleHelper.logErrorMessage(err.message);
                process.exit();
            });
        });
    }

    static logFailedAndEnd()
    {
        ConsoleHelper.logErrorMessage('Failed to create Zation example app');
        process.exit();
    }

    static confirmReplaceSetup(confirm)
    {
        if (confirm)
        {
            ConsoleHelper.logSetup();
            if (FileHelper.removeDirRecursive(destDir) && FileHelper.copyDirRecursive(sampleDir, destDir))
            {
                ConsoleHelper.logSuccessMessage();
            } else {
                ConsoleHelper.logFailedToCreateMessage();
            }
        } else
        {
            ConsoleHelper.logErrorMessage("Zation 'create' action was aborted.");
            process.exit();
        }
    }
}

class ExampleCreateHelper
{
    static create()
    {
        if (arg1)
        {
            if (FileHelper.fileExistsSync(destDir))
            {
                if (force)
                {
                    ConsoleHelper.confirmReplaceSetup(true);
                } else {
                    let message = "There is already a directory at " + destDir + '. Do you want to overwrite it?';
                    ConsoleHelper.promptConfirm(message)
                        .then((a) => {ConsoleHelper.confirmReplaceSetup(a);})
                }
            } else {
                ConsoleHelper.logSetup();

                if (FileHelper.copyDirRecursive(sampleDir, destDir)) {
                    ExampleCreateHelper._createSuccess();
                } else {
                    ConsoleHelper.logFailedAndEnd();
                }
            }
        }
        else {
            ConsoleHelper.logErrorMessage("The 'create' command requires a valid [appname] as argument.");
            ConsoleHelper.logHelp();
            process.exit();
        }
    }

    static _createSuccess()
    {
        console.log('Installing app dependencies using npm. This could take a while...');

        let npmCommand = (process.platform === "win32" ? "npm.cmd" : "npm");
        let options = {
            cwd: destDir,
            maxBuffer: Infinity
        };

        let npmProcess = spawn(npmCommand, ['install'], options);

        npmProcess.stdout.on('data', function (data) {
            process.stdout.write(data);
        });

        npmProcess.stderr.on('data', function (data) {
            process.stderr.write(data);
        });

        npmProcess.on('close', function (code) {
            if (code)
            {
                ConsoleHelper.logErrorMessage(`Failed to install npm dependencies. Exited with code ${code}.`);
            }
            process.exit(code);
        });

        npmProcess.stdin.end();
    }
}


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

if (command === 'create')
{
    ExampleCreateHelper.create(arg1);
}
else
{
    ConsoleHelper.logErrorMessage(`'${command} is not a valid Zation command.'`);
    ConsoleHelper.logHelp();
    process.exit();
}

