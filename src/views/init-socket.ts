import { addQueue } from '../db-queue';
import { toYouTubeEmbedded } from '../utils/urlParser';
import { DonationAlertsMessage } from './init-socket.models';
import { IQueueItem } from '../db-queue/index.models';
const io = require('socket.io-client');



export class DonationAlertsSocket {
    constructor(userId: string, token: string) {
        const socket = io.connect('wss://socket.donationalerts.ru:443', {
            reconnection: true,
            reconnectionDelayMax: 5000,
            reconnectionDelay: 1000,
        });

        socket.on('connect', () => {
            socket.emit('add-user', {token: token, type: 'alert_widget'});
        });

        // let counter = 0;
        socket.on('donation', (msg: any) => {
            const newDonation: DonationAlertsMessage = JSON.parse(msg);
            if (newDonation) {
                // TODO: remove after tests
                // counter++;
                // newDonation.amount = counter;
                // newDonation.message = '[https://youtu.be/oFElsHvWxn0?t=6058, x2] some text';

                const videoRegArr = newDonation.message.match(/\[([^)]+)\]/gm);

                if (videoRegArr && videoRegArr[0]) {
                    // get video string
                    let videoStr = videoRegArr[0];
                    // remove brackets
                    videoStr = videoStr.replace(/[\[\]']+/g, '');

                    const videoArr = videoStr.split(',');
                    const youtubeUrl = videoArr[0];
                    const queueType = videoArr[1].trim();

                    // convert youtube link tu embedded link
                    const url = toYouTubeEmbedded(youtubeUrl);

                    const newVideoObj: IQueueItem = {
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

                    addQueue(userId, newVideoObj);
                }
            }
        });
    }
}
