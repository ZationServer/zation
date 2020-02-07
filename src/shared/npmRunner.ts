const childProcess       = require('child_process');
const spawn              = childProcess.spawn;

export default class NpmRunner
{
    static installDependencies(destDir : string,progressCallback : () => void)
    {
        return new Promise((resolve,reject) =>
        {
            const npmCommand = (process.platform === "win32" ? "npm.cmd" : "npm");
            const npmProcess = spawn(npmCommand, ['install'], {cwd: destDir, maxBuffer: Infinity});

            npmProcess.stdout.on('data', () => progressCallback());
            npmProcess.stderr.on('data', () => progressCallback());

            npmProcess.on('close', (code : any) => {
                if (code) {
                    reject(new Error(`Failed to install. Code: ${code}`));
                }
                else {
                    resolve();
                }
            });
            npmProcess.stdin.end();
        });
    }
}