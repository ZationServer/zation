import {Config, $init} from 'zation-server';

import "../app";

export default Config.appConfig({
    userGroups: {
        auth: {
            admin: {},
            user: {},
        },
        default: 'guest'
    },

    controllerDefaults: {
        access: 'all'
    },

    events: {
        express: (express) => {
            express.get('/',(_,res) => {
                res.send('Application Server');
            });
        },

        socketConnection: $init((bag) => {
            const workerId = bag.getWorkerId();
            return (socket) => {
                bag.log.info(`New socket (${socket.id}) connected on worker: ${workerId}`);
            }
        })
    }
});