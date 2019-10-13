import {Config, eventInit} from 'zation-server';

module.exports = Config.eventConfig(
    {
        express : (bag, express) => {
            express.get('/',(req,res) => {
                res.send('Application Server');
            });
        },

        socketConnection : eventInit((bag) => {
            const workerId = bag.getWorkerId();
            return (bag, socket) => {
                console.log('New Socket connected: ',socket.id,' on worker: ',workerId);
            }
        })

    });