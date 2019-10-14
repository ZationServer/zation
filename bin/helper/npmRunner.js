/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

const childProcess       = require('child_process');
const spawn              = childProcess.spawn;
const ConsoleHelper      = require('./consoleHelper');
const term               = require('terminal-kit').terminal;

class NpmRunner
{
    static installDependencies(destDir)
    {
        return new Promise((resolve) =>
        {
            const npmCommand = (process.platform === "win32" ? "npm.cmd" : "npm");

            const npmProcess = spawn(npmCommand, ['install'], {cwd: destDir, maxBuffer: Infinity});

            let progressBar , progress = 0 ;

            npmProcess.stdout.on('data', () => {
                if(progress < 80){
                    progress += Math.random() / 5;
                    progressBar.update(progress);
                }
            });
            npmProcess.stderr.on('data', () => {
                if(progress < 80){
                    progress += Math.random() / 10;
                    progressBar.update(progress);
                }
            });

            progressBar = term.progressBar( {
                width: 80 ,
                title: 'Installing app dependencies using npm. This could take a while...',
                eta: true ,
                percent: true
            });

            npmProcess.on('close', (code) => {
                if (code) {
                    progressBar.stop();
                    term('\n');
                    ConsoleHelper.logErrorMessage(`Failed to install npm dependencies. Exited with code ${code}.`);
                    process.exit(code);
                }
                else {
                    progressBar.update(100);
                    term('\n');
                    ConsoleHelper.logSuccessMessage(`Npm dependencies were successfully installed.`);
                    resolve();
                }
            });

            npmProcess.stdin.end();
        });
    }
}

module.exports = NpmRunner;
