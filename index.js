const ioClient = require('socket.io-client');

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const DBqueue = require("./db-queue");
const urlParser = require('./utils/urlParser');



const socket = ioClient.connect('wss://socket.donationalerts.ru:443', {
    reconnection: true,
    reconnectionDelayMax: 5000,
    reconnectionDelay: 1000,
});
socket.on('connect', () => {
    socket.emit('add-user', {token: 'KflrIWcoLbdpkKQbvrWG', type: 'alert_widget'});
});

let counter = 0;
socket.on('donation', (msg) => {
    const newDonation = JSON.parse(msg);
    if (newDonation) {
        // TODO: remove after tests
        counter++;
        newDonation.amount = counter;
        newDonation.message = '[https://youtu.be/oFElsHvWxn0?t=6058, x1] some text';

        const videoReg = newDonation.message.match(/(?<=\[).+?(?=\])/gm);

        if (videoReg && videoReg[0]) {
            const videoArr = videoReg[0].split(',');
            const youtubeUrl = videoArr[0];
            const queueType = videoArr[1].trim();

            // convert youtube link tu embedded link
            let url = urlParser.toYouTubeEmbedded(youtubeUrl);

            const newVideoObj = {
                message: newDonation.message,
                username: newDonation.username,
                amount: newDonation.amount,
                currency: newDonation.currency,
                date_created: newDonation.date_created,
                url,
                queueType
            };

            console.log(newVideoObj);

            DBqueue.addQueue(newVideoObj);
        }
    }
});



const ping = require('ping');
require('dns').lookup(require('os').hostname(), function (err, ip) {
    ping.sys.probe(ip, function(isAlive) {
        const msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
        console.log(msg);
    });
});
