const path = require('path');
const redis = require('redis');
const hydraConfig = require('./config.json');
const hydraExpress = require('hydra-express');
const hydra = hydraExpress.getHydra();

const sendMessage = (msg) => {
    let message;
    message = hydra.createUMFMessage({
        to: 'consumer:/',
        frm: 'server:/',
        bdy: {
            message: msg
        }
    });
    hydra.sendMessage(message);

    message = hydra.createUMFMessage({
        to: 'worker:/',
        frm: 'server:/',
        bdy: {
            message: msg
        }
    });
    hydra.sendMessage(message);
};

exports.onRegisterRoutes = () => {
    let express = hydraExpress.getExpress();
    let app = hydraExpress.getExpressApp();

    const client = redis.createClient({
        host: hydraConfig.hydra.redis.url,
        db: 3
    });

    let api = express.Router();

    api.get('/', (req, res) => {
        sendMessage('Hydra messaging');
        res.json({message: 'Hydra messaging'});
    });

    api.get('/action', (req, res) => {
        client.get('actions', (error, result) => {
            if (error) console.log('Error: '+ error);
            else console.log('Actions: ' + result);
            sendMessage('action');
            res.json({message: 'Action!'});
        });
    });

    hydraExpress.registerRoutes({
        '': api
    });
};
