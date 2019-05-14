import express from 'express';
import cors from 'cors';
import {DonationAlertsSocket} from './views/init-socket';
import {getUsers} from "./db-queue";


const app = express();
const port = 3000;
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4200'
}));


const activeUsers = new Set();


getUsers().then(users => {
    if (users && users.length > 0) {
        users.forEach(userData => {
            const settings = userData.settings;
            const user = userData.user;

            if (
                user.id
                && settings.donationalertsId
                && !activeUsers.has(user.id)
            ) {
                activeUsers.add(user.id);
                new DonationAlertsSocket(user.id, settings.donationalertsId);
            } else {
                console.error('User have no required data');
            }
        });
    } else {
        console.error('No users found');
    }
});

app.post('/settings', function(req, res){
    const donationalertsId = req.body.donationalertsId;
    const userId = req.get('userId');

    if (userId && donationalertsId && !activeUsers.has(userId)) {
        activeUsers.add(userId);
        new DonationAlertsSocket(userId, donationalertsId);
    }
    res.json(req.body);
});


app.listen(port, () => console.log(`App listening on port ${port}!`));
