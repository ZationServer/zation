/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {
    zationAssuredVersion,
    zationBundleVersion,
    zationClientVersion,
    zationBrokerVersion,
    zationStateVersion,
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
        console.log(`Zation State Version: ${zationStateVersion}`);
        console.log(`Zation Broker Version: ${zationBrokerVersion}`);
    },
    welcome: () => {
        term.cyan(`Thank you for using the Zation Framework 🚀 (Bundle:${zationBundleVersion}) (https://github.com/ZationServer)!\n`);
    },
};

