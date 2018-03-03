const CronJob = require('cron').CronJob;
const hydraConfig = require('./config.json');
const hydraExpress = require('hydra-express');
const version = require('./package.json').version;
const hydra = hydraExpress.getHydra();

const sendMessage = (msg) => {
    let message = hydra.createUMFMessage({
        to: 'worker:/',
        frm: 'cronjob:/',
        bdy: {
            message: msg
        }
    });
    hydra.sendMessage(message);
};

const job = new CronJob('00 * * * * *', () => {
    sendMessage('Cronjob data');
}, null, true, 'America/Los_Angeles');

hydraExpress.init(hydraConfig, version, () => {}).then((serviceInfo) => {
    job.start();
}).catch((err) => {
    console.log('err', err);
});
