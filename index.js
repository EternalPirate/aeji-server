var ioClient = require('socket.io-client');

var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

var DBqueue = require("./db-queue");
var urlParser = require('./utils/urlParser');


var socket = ioClient.connect('wss://socket.donationalerts.ru:443', {
    reconnection: true,
    reconnectionDelayMax: 5000,
    reconnectionDelay: 1000,
});
socket.on('connect', function() {
    socket.emit('add-user', {token: 'KflrIWcoLbdpkKQbvrWG', type: 'alert_widget'});
});

var counter = 0;
socket.on('donation', function(msg) {
    var newDonation = JSON.parse(msg);
    if (newDonation) {
        // TODO: remove after tests
        counter++;
        newDonation.amount = counter;
        newDonation.message = '[https://youtu.be/oFElsHvWxn0?t=6058, x1] some text';

        var videoReg = newDonation.message.match(/(?<=\[).+?(?=\])/gm);

        if (videoReg && videoReg[0]) {
            var videoArr = videoReg[0].split(',');
            var youtubeUrl = videoArr[0];
            var queueType = videoArr[1].trim();

            // convert youtube link tu embedded link
            var url = urlParser.toYouTubeEmbedded(youtubeUrl);

            var newVideoObj = {
                message: newDonation.message,
                username: newDonation.username,
                amount: newDonation.amount,
                currency: newDonation.currency,
                date_created: newDonation.date_created,
                url: url,
                queueType: queueType
            };

            console.log(newVideoObj);

            DBqueue.addQueue(newVideoObj);
        }
    }
});
