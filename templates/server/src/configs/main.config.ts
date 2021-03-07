import {Config} from 'zation-server';

export default Config.mainConfig({
    port: {{port}},
    appName: '{{name}/pc}',
    panel: {
        active: true,
        user: {username: 'admin', password: 'admin'}
    },
});