import {Config, $init} from 'zation-server';

//Controllers
import "../controllers/auth/LoginController";

//Databoxes
import "../databoxes/ProfileDatabox";

export default Config.appConfig({
    userGroups: {
        auth: {
            admin: {},
            user: {},
        },
        default: 'guest'
    },

    controllerDefaults: {
        wsAccess: true,
        httpAccess: false,
        httpPostAllowed: true,
        httpGetAllowed: true,
        access: 'all'
    },

    events: {
        express: (express) => {
            express.get('/',(req,res) => {
                res.send('Application Server');
            });
        },

        socketConnection: $init((bag) => {
            const workerId = bag.getWorkerId();
            return (socket) => {
                console.log('New Socket connected: ',socket.id,' on worker: ',workerId);
            }
        })
    }
});