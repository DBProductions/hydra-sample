const routes = require('./routes');
const hydraConfig = require('./config.json');
const hydraExpress = require('hydra-express');
const version = require('./package.json').version;
const hydra = hydraExpress.getHydra();

hydraExpress.init(hydraConfig, version, routes.onRegisterRoutes).then((serviceInfo) => {
    hydra.on('message', (message) => {
        hydraExpress.log('info', message);
    });
}).catch((err) => {
    console.log('err', err);
});
