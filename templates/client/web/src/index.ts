import {create} from 'zation-client';
import * as $ from "jquery";

(async () => {

    const client = create({
        hostname: '{{serverHost}}',
        port: {{serverPort}},
        debug: false
    });

    try {
        await client.connect();

        for(let i = 1; i < 6; i++) {
            $('body').append($('<p/>').text(`Ping ${i}: ${await client.ping()}ms`));
        }
    }
    catch (e) {
        $('body').append($('<p/>').text(e));
    }

})();
