import {create} from 'zation-client';

(async () => {

    const client = create({
        hostname: '{{serverHost}}',
        port: {{serverPort}},
        debug: false
    });

    try {
        await client.connect();

        for(let i = 1; i < 6; i++) {
            console.log(`Ping ${i}: ${(await client.ping()).toFixed(3)}ms`);
        }
    }
    catch (e) {
        console.error(e);
    }

})();
