/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

const childProcess       = require('child_process');
const spawn              = childProcess.spawn;
const ConsoleHelper      = require('./consoleHelper');

class NpmRunner
{

    static installGlobal(packageName,destDir)
    {
        return new Promise((resolve) =>
        {
            const onlyName = packageName.split('@')[0];
            const npmCommand = (process.platform === "win32" ? "npm.cmd" : "npm");

            ConsoleHelper.logBusyMessage(`Installing ${onlyName} global using npm. This could take a while...`);

            let npmProcess =
                spawn(npmCommand, ['install','-g',packageName], {cwd: destDir, maxBuffer: Infinity});

            npmProcess.stdout.on('data', function (data) {
                process.stdout.write(data);
            });

            npmProcess.stderr.on('data', function (data) {
                process.stderr.write(data);
            });

            npmProcess.on('close', function (code) {
                if (code) {
                    ConsoleHelper.logErrorMessage(`Failed to install ${onlyName} global. Exited with code ${code}.`);
                    process.exit(code);
                }
                else {
                    ConsoleHelper.logSuccessMessage(`Package ${onlyName} was successfully installed globally.`);
                    resolve();
                }
            });

            npmProcess.stdin.end();
        });
    }

    static installDependencies(destDir)
    {
        return new Promise((resolve) =>
        {
            const npmCommand = (process.platform === "win32" ? "npm.cmd" : "npm");

            ConsoleHelper.logBusyMessage('Installing app dependencies using npm. This could take a while...');

            let npmProcess = spawn(npmCommand, ['install'], {cwd: destDir, maxBuffer: Infinity});

            npmProcess.stdout.on('data', function (data) {
                process.stdout.write(data);
            });

            npmProcess.stderr.on('data', function (data) {
                process.stderr.write(data);
            });

            npmProcess.on('close', function (code) {
                if (code) {
                    ConsoleHelper.logErrorMessage(`Failed to install npm dependencies. Exited with code ${code}.`);
                    process.exit(code);
                }
                else {
                    ConsoleHelper.logSuccessMessage(`Npm dependencies were successfully installed.`);
                    resolve();
                }
            });

            npmProcess.stdin.end();
        });
    }


}

module.exports = NpmRunner;
