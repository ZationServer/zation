import {Config} from "zation-server";

Config.serverConfig({
    port: {{port}},
    debug: false,
    launchDebug: false,
    panel: {
        active: true,
        user: {username: 'admin', password: 'admin'}
    },
}).register();