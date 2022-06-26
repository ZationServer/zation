import {Config, $init} from 'zation-server';

import "../app";

Config.appConfig({
    appName: '{{name}/pc}',

    userGroups: {
        auth: {
            admin: {},
            user: {},
        },
        default: 'guest',
    },

    controllerDefaults: {
        access: 'all',
    },

    events: {
        socketConnection: $init(bag => {
            const serverInfo = `${bag.serverId} (${bag.serverUrl})`;
            return socket => {
                bag.log.info(`New socket (${socket.id}) connected on server: ${serverInfo}.`);
            }
        }),
    },
}).register();