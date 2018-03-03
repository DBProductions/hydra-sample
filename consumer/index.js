const hydraConfig = require('./config.json');
const hydraExpress = require('hydra-express');
const version = require('./package.json').version;
const hydra = hydraExpress.getHydra();

hydraExpress.init(hydraConfig, version, () => {}).then((serviceInfo) => {
    hydra.on('log', (entry) => {
        hydraExpress.log('info', 'Hydra logs');
    });
    hydra.on('message', (message) => {
        hydraExpress.log('info', {
            'mid': message.mid,
            'route': message.frm + '->' + message.to,
            'ts': message.ts,
            'body': message.bdy
        });

        hydra.findService('server')
        .then((service) => {
            hydraExpress.log('info', service);
        }).catch((err) => {
            hydraExpress.log('error', err);
        });

        hydra.getServicePresence('worker')
        .then((service) => {
            hydraExpress.log('info', service);
        }).catch((err) => {
            hydraExpress.log('error', err);
        });
    });
}).catch((err) => {
    console.log('err', err)
});
