import { AbortedCommandError } from '../../shared/abortedCommandError';
import { gitClone } from '../../shared/gitCloner';
import { zationClusterStateVersion, zationClusterBrokerVersion } from '../../versions';
import NpmRunner from '../../shared/npmRunner';
import {print} from "../../shared/consoleHelper";
import {checkDir, processDestination} from "../../shared/fsUtils";
import {terminal as term} from 'terminal-kit';

export enum ClusterComponent {
    State,Broker
}

function getClusterComponentPackageName(component : ClusterComponent): string {
    switch(component) {
        case ClusterComponent.State:
            return "zation-cluster-state";
        case ClusterComponent.Broker:
            return "zation-cluster-broker";
    }
}

function getClusterComponentName(component : ClusterComponent): string {
    switch(component) {
        case ClusterComponent.State:
            return "Zation Cluster State";
        case ClusterComponent.Broker:
            return "Zation Cluster Broker";
    }
}

function getClusterComponentVersion(component : ClusterComponent): string {
    switch(component) {
        case ClusterComponent.State:
            return zationClusterStateVersion;

        case ClusterComponent.Broker:
            return zationClusterBrokerVersion;
    }
}

function getClusterComponentHelperText(component : ClusterComponent): string {
    switch(component) {
        case ClusterComponent.State:
            return "You can start the zation-cluster-state server with 'npm start'.";
        case ClusterComponent.Broker:
            return "You can start the zation-cluster-broker server with 'STATE_SERVER_HOST=\"localhost\" node index.js'.";
    }
}

function getClusterComponentGitAddress(component : ClusterComponent) {
    return `direct:https://github.com/ZationServer/${
        getClusterComponentPackageName(component)}.git#${getClusterComponentVersion(component)}`;
}

export async function cloneClusterComponent(processDir: string,force: boolean,component?: ClusterComponent) {

    try{
        await cloneClusterComponentStart(processDir, force, component);
    }
    catch(e) {
        if(e instanceof AbortedCommandError && !e.Silent) {
            print.warning("Clone cluster component aborted.");
        }
    }
}

export async function cloneClusterComponentStart(processDir: string,force: boolean,componentType?: ClusterComponent) {

    if(componentType === undefined){
        term.cyan('Which type of cluster component do you want to clone?\n');
        const res = await term.singleColumnMenu(['State Server (Clones the zation-cluster-state server)',
            'Broker Server (Clones the zation-cluster-broker server)'],{cancelable: true}).promise;
        term("\n");
        if(res.canceled) {
            throw new AbortedCommandError();
        }
        componentType = res.selectedIndex === 0 ? ClusterComponent.State : ClusterComponent.Broker;
    }

    const destDir = processDestination(processDir,getClusterComponentPackageName(componentType));

    await checkDir(destDir,force);

    const startTimeStamp = Date.now();

    const preTitle = `Clone ${getClusterComponentName(componentType)}: `;
    let progress = 0;
    const progressBar = term.progressBar({
        width: 80,
        title: preTitle,
        eta: true,
        percent: true,
        titleSize: 40
    });

    progressBar.update({title: preTitle + "Clone...", progress});
    try {
        await gitClone(getClusterComponentGitAddress(componentType),destDir);
    }
    catch (e) {
        progressBar.stop();
        print.error(`Failed to clone repository: ${e.toString()}`);
        return;
    }
    progressBar.update({progress: progress += 0.3});

    progressBar.update({title: preTitle + "Install dependencies...", progress});

    let installIncrement = 0;
    try {
        await NpmRunner.installDependencies(destDir,() => {
            if(installIncrement < 0.7){
                let addIncrement = (Math.random() * 15) / 100;
                installIncrement += addIncrement;
                if(installIncrement > 0.7) { installIncrement = 0.7 - installIncrement; }
                progressBar.update({progress: progress += addIncrement});
            }
        });
    }
    catch(e) {
        progressBar.stop();
        print.error(`Failed to install dependencies: ${e.toString()}`);
        return;
    }

    progressBar.update({progress: 1});
    progressBar.stop();
    print.newLine();

    const timeSeconds = ((Date.now() - startTimeStamp) / 1000).toFixed(1);
    print.success(`The ${getClusterComponentName(componentType)} cloned in ${timeSeconds}s. 🎉`);
    print.info(`   ${getClusterComponentHelperText(componentType)}`);
    print.info(`   But do not forget to change the directory with 'cd ${getClusterComponentPackageName(componentType)}'.`);
}