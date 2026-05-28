const express = require('express');


const {
    Client,
    LocalAuth
} = require('whatsapp-web.js');

const qrcode = require('qrcode');

const app = express();

let qrCodeImage = null;

/*
WHATSAPP CLIENT
*/



const client = new Client({

    authStrategy: new LocalAuth(),

    puppeteer: {

        headless: true,

        executablePath: '/usr/bin/chromium',

        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]

    }

});
/*
QR EVENT
*/

client.on('qr', async (qr) => {

    console.log('QR RECEIVED');

    qrCodeImage =
        await qrcode.toDataURL(qr);

});

/*
READY
*/

client.on('ready', () => {

    console.log(
        'WhatsApp Ready'
    );

});

/*
AUTHENTICATED
*/

client.on('authenticated', () => {

    console.log(
        'Authenticated'
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
        'WhatsApp Server Running'
    );

});

/*
QR PAGE
*/

app.get('/qr', (req, res) => {

    if (!qrCodeImage) {

        return res.send(
            'QR Loading...'
        );

    }

    res.send(`
        <h2>Scan WhatsApp QR</h2>
        <img src="${qrCodeImage}" />
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
SEND MESSAGE API
*/

app.get('/send', async (req, res) => {

    try {

        const number =
            req.query.number;

        const message =
            req.query.message;

        const chatId =
            number + '@c.us';

        await client.sendMessage(
            chatId,
            message
        );

        res.json({

            status: true,
            message: 'Message Sent'

        });

    } catch (error) {

        res.json({

            status: false,
            error: error.message

        });

    }

});

/*
PORT
*/

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {

    console.log(
        'Server Running on Port ' + PORT
    );

});
