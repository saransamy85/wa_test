const express = require('express');

const {
    Client,
    LocalAuth
} = require('whatsapp-web.js');

const qrcode = require('qrcode');

const app = express();

let qrImage = null;

/*
WHATSAPP CLIENT
*/

const client = new Client({

    authStrategy: new LocalAuth(),

    puppeteer: {

        headless: true,

        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]

    }

});

/*
QR EVENT
*/

client.on('qr', async (qr) => {

    console.log('QR RECEIVED');

    qrImage =
        await qrcode.toDataURL(qr);

});

/*
READY
*/

client.on('ready', () => {

    console.log('WhatsApp Ready');

});

/*
AUTHENTICATED
*/

client.on('authenticated', () => {

    console.log('Authenticated');

});

/*
AUTH FAILURE
*/

client.on('auth_failure', msg => {

    console.log(
        'AUTH FAILURE',
        msg
    );

});

/*
DISCONNECTED
*/

client.on('disconnected', reason => {

    console.log(
        'Disconnected',
        reason
    );

});

/*
INITIALIZE
*/

client.initialize();

/*
HOME
*/

app.get('/', (req, res) => {

    res.send(
        'WhatsApp Dashboard Running'
    );

});

/*
QR PAGE
*/

app.get('/qr', (req, res) => {

    if (!qrImage) {

        return res.send(
            'QR Loading...'
        );

    }

    res.send(`
        <h2>Scan QR</h2>
        <img src="${qrImage}" />
    `);

});

/*
STATUS
*/

app.get('/status', (req, res) => {

    if (client.info) {

        return res.json({

            connected: true,

            number:
                client.info.wid.user

        });

    }

    res.json({

        connected: false

    });

});

/*
PORT
*/

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        'Server Running'
    );

});
