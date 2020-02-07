import * as downloadGitRepo from 'download-git-repo';

export function gitClone(address: string,destDir: string) : Promise<void> {
    return new Promise((resolve,reject) => {
        downloadGitRepo(address,destDir,{ clone: true }, (err : any) => {
            if(err) {
                reject(new Error(`Failed to clone. Error: ${err}`));
            }
            resolve();
        });
    });
}