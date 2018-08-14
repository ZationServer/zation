/*
  This script waits for the master controller script to become available.
  With orchestrators like Kubernetes, the master controller file may be fed in through
  a volume container at runtime and so it is necessary to wait for it before launch.
*/

const fsUtil = require('zation').FsUtil;
const waitForFile = fsUtil.waitForFile;

const masterControllerPath = './index.js';
const bootCheckInterval =  200;
const bootTimeout = 10000;
const bootStartTime = Date.now();

const errorMessage = `Failed to locate the master controller file at path ${masterControllerPath} before ${bootTimeout}`;

waitForFile(masterControllerPath, bootCheckInterval, bootStartTime, bootTimeout, errorMessage)
    .catch((err) => {
        console.error('> Boot error: ' + err.message);
        process.exit(1);
    });