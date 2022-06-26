import {Client} from 'zation-client';
import * as $ from "jquery";

(async () => {

    const client = Client.create({
        hostname: '{{serverHost}}',
        port: {{serverPort}},
        debug: false
    });

    try {
        await client.connect();

        for(let i = 1; i < 6; i++) {
            $('body').append($('<p/>').text(`Ping ${i}: ${(await client.ping()).toFixed(3)}ms`));
        }
    }
    catch (e) {
        $('body').append($('<p/>').text(e));
    }

})();