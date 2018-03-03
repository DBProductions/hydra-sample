const redis = require('redis');
const hydraConfig = require('./config.json');
const hydraExpress = require('hydra-express');
const version = require('./package.json').version;
const hydra = hydraExpress.getHydra();

require('redis-lua2').attachLua(redis);

redis.lua('myset', 'return redis.call("set", KEYS[1], KEYS[2])');

const client = redis.createClient({
    host: hydraConfig.hydra.redis.url,
    db: 3
});

hydraExpress.init(hydraConfig, version, () => {})
.then((serviceInfo) => {
    hydra.on('message', (message) => {
        // do some work
        client.myset(2, 'testing', 'surprise', redis.print);
        client.get('testing', (error, result) => {
            if (error) console.log('Error: '+ error);
            else console.log('Name: ' + result);
        });

        client.set('sum1', '5');
        client.get('sum1', (error, result) => {
            if (error) console.log('Error: '+ error);
            else console.log('Name: ' + result);
        });

        if (message.bdy === 'action') {
            hydraExpress.log('info', 'action arrived');
            client.set('actions', message.ts);
        }

        // reply to message
        let messageReply = hydra.createUMFMessage({
            to: message.frm,
            frm: 'worker:/',
            bdy: {
                msg: `reply from ${hydra.getServiceName()} - ${hydra.getInstanceID()}`
            }
        });
        hydra.sendMessage(messageReply);

        // send additional message
        message = hydra.createUMFMessage({
            to: 'consumer:/',
            frm: 'worker:/',
            bdy: message
        });
        hydra.sendMessage(message);
    });
}).catch((err) => {
    console.log('err', err)
});
