import io from 'socket.io-client';
import { addQueue } from './db-queue';
import { toYouTubeEmbedded } from './utils/urlParser';


const socket = io.connect('wss://socket.donationalerts.ru:443', {
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
            let url = toYouTubeEmbedded(youtubeUrl);

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

            addQueue(newVideoObj);
        }
    }
});