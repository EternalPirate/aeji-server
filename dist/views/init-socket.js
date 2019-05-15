"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_queue_1 = require("../db-queue");
const urlParser_1 = require("../utils/urlParser");
const io = require('socket.io-client');
class DonationAlertsSocket {
    constructor(userId, token) {
        const socket = io.connect('wss://socket.donationalerts.ru:443', {
            reconnection: true,
            reconnectionDelayMax: 5000,
            reconnectionDelay: 1000,
        });
        socket.on('connect', () => {
            socket.emit('add-user', { token: token, type: 'alert_widget' });
        });
        let counter = 0;
        socket.on('donation', (msg) => {
            const newDonation = JSON.parse(msg);
            if (newDonation) {
                // TODO: remove after tests
                counter++;
                newDonation.amount = counter;
                newDonation.message = '[https://youtu.be/oFElsHvWxn0?t=6058, x2] some text';
                let videoStr = newDonation.message.match(/\[([^)]+)\]/gm)[0];
                if (videoStr) {
                    // remove brackets
                    videoStr = videoStr.replace(/[\[\]']+/g, '');
                    const videoArr = videoStr.split(',');
                    const youtubeUrl = videoArr[0];
                    const queueType = videoArr[1].trim();
                    // convert youtube link tu embedded link
                    const url = urlParser_1.toYouTubeEmbedded(youtubeUrl);
                    const newVideoObj = {
                        id: +new Date(),
                        message: newDonation.message,
                        username: newDonation.username,
                        amount: newDonation.amount,
                        currency: newDonation.currency,
                        date_created: newDonation.date_created,
                        url,
                        queueType
                    };
                    console.log(newVideoObj);
                    db_queue_1.addQueue(userId, newVideoObj);
                }
            }
        });
    }
}
exports.DonationAlertsSocket = DonationAlertsSocket;
//# sourceMappingURL=init-socket.js.map