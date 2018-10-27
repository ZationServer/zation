import {create} from 'zation-client';

(async () => {

    const client = create({
        hostname : '{{serverHost}}',
        port : {{serverPort}},{{nlServerPath}}{{nlServerPostKey}}
        debug : {{useDebug}}
    });

    try {
        await client.connect();

        for(let i = 1; i < 6; i++) {
            console.log(`Ping ${i}: ${await client.ping()}ms`);
        }
    }
    catch (e) {
        console.error(e);
    }

    process.exit();

})();

