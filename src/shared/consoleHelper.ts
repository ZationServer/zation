import {
    zationAssuredVersion,
    zationBundleVersion,
    zationClientVersion, zationClusterBrokerVersion,
    zationClusterStateVersion,
    zationServerVersion
} from "../versions";
import {terminal as term} from 'terminal-kit';

export const print = {
    newLine: () => {
      term("\n");
    },
    success: (message: string) => {
        console.log('\x1b[32m%s\x1b[0m', '   [Success]',message);
    },
    busy: (message: string) => {
        console.log('\x1b[33m%s\x1b[0m','   [BUSY]',message);
    },
    warning: (message: string) => {
        console.log('\x1b[33m%s\x1b[0m', '   [Warning]',message);
    },
    info: (message: string) => {
        console.log('\x1b[34m%s\x1b[0m','   [INFO]',message);
    },
    error: (message: string) => {
        console.log('\x1b[31m%s\x1b[0m', '   [Error]',message);
    },
    versions: () => {
        term.cyan(`Zation Bundle Version: ${zationBundleVersion}\n`);
        console.log(`Zation Server Version: ${zationServerVersion}`);
        console.log(`Zation Client Version: ${zationClientVersion}`);
        console.log(`Zation Assured Version: ${zationAssuredVersion}`);
        console.log(`Zation Cluster State Version: ${zationClusterStateVersion}`);
        console.log(`Zation Cluster Broker Version: ${zationClusterBrokerVersion}`);
    },
    welcome: () => {
        term.cyan(`Thank you for using the Zation ({${zationBundleVersion}) Framework 🚀 (https://github.com/ZationServer)!\n`);
    },
    projectNpmCommands: () => {
        console.log();
        console.log('Npm project commands (Only works in Zation CLI created projects):');
        console.log('  For server project:');
        console.log(`     npm start                           Starts the server (and build it (only typescript)).`);
        console.log(`     npm test                            Runs all tests (and build it (only typescript)).`);
        console.log(`     npm run check                       Checks all Zation configurations.`);
        console.log(`     npm run build                       Builds the project.`);
        console.log(`     npm run watch                       Starts to build automatically when a file changes.`);
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
};

