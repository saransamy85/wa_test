const express = require('express');
const cors = require('cors');
const qrcode = require('qrcode-terminal');

const { Client, LocalAuth } = require('whatsapp-web.js');

const app = express();

app.use(cors());
app.use(express.json());

/*
|--------------------------------------------------------------------------
| WhatsApp Client
|--------------------------------------------------------------------------
*/

const client = new Client({

    authStrategy: new LocalAuth(),

    puppeteer: {
        headless: true,

        executablePath:
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',

        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    }
});

/*
|--------------------------------------------------------------------------
| QR Code
|--------------------------------------------------------------------------
*/

client.on('qr', (qr) => {

    console.log('Scan this QR Code:\n');

    qrcode.generate(qr, {
        small: true
    });

});

/*
|--------------------------------------------------------------------------
| Ready
|--------------------------------------------------------------------------
*/

client.on('ready', () => {

    console.log('WhatsApp Ready!');

});

/*
|--------------------------------------------------------------------------
| Authenticated
|--------------------------------------------------------------------------
*/

client.on('authenticated', () => {

    console.log('WhatsApp Authenticated');

});

/*
|--------------------------------------------------------------------------
| Authentication Failure
|--------------------------------------------------------------------------
*/

client.on('auth_failure', (msg) => {

    console.log('Authentication Failed:', msg);

});

/*
|--------------------------------------------------------------------------
| Disconnected
|--------------------------------------------------------------------------
*/

client.on('disconnected', (reason) => {

    console.log('WhatsApp Disconnected:', reason);

});

/*
|--------------------------------------------------------------------------
| Initialize WhatsApp
|--------------------------------------------------------------------------
*/

client.initialize();

/*
|--------------------------------------------------------------------------
| Send Message API
|--------------------------------------------------------------------------
*/

app.post('/send-message', async (req, res) => {

    try {

        /*
        CONVERT TO STRING
        */

        let mobile = String(req.body.number)
            .replace(/\D/g, '');

        /*
        REMOVE EXTRA 91
        */

        if (
            mobile.startsWith('91') &&
            mobile.length > 10
        ) {
            mobile = mobile.substring(2);
        }

        /*
        WHATSAPP FORMAT
        */

        const number = `91${mobile}@c.us`;

        const message = req.body.message;

        console.log('Sending To:', number);

        /*
        CHECK NUMBER EXISTS
        */

        const isRegistered =
            await client.isRegisteredUser(number);

        if (!isRegistered) {

            return res.json({
                status: false,
                error: 'Number not registered on WhatsApp'
            });

        }

        /*
        SEND MESSAGE
        */

        const result =
            await client.sendMessage(number, message);

        res.json({
            status: true,
            message: 'WhatsApp Sent Successfully',
            id: result.id.id
        });

    } catch (err) {

        console.log(err);

        res.json({
            status: false,
            error: err.message
        });

    }

});
/*
|--------------------------------------------------------------------------
| Home Route
|--------------------------------------------------------------------------
*/

app.get('/', (req, res) => {

    res.send('WhatsApp Server Running');

});

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

const PORT = 3000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});