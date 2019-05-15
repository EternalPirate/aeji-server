import express from 'express';
import { DonationAlertsSocket } from './views/init-socket';
import { getUsers } from './db-queue';


const app = express();
const activeUsers = new Set();

export interface IGoogleUserProfile {
  email: string;
  family_name: string;
  given_name: string;
  granted_scopes: string;
  id: string;
  locale: string;
  name: string;
  picture: string;
  verified_email: boolean;
}

export interface IUserSettings {
  donationalertsId: string;
}

export interface IUserData {
  settings: IUserSettings;
  user: IGoogleUserProfile;
}

getUsers().then((users: IUserData[]) => {
  if (users && users.length > 0) {
    users.forEach((userData: IUserData) => {
      const settings: IUserSettings = userData.settings;
      const user: IGoogleUserProfile = userData.user;


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

app.post('/settings', (req, res) => {
  const donationalertsId = req.body.settings.donationalertsId;
  const userId = req.body.userId;

  if (userId && donationalertsId && !activeUsers.has(userId)) {
    activeUsers.add(userId);
    new DonationAlertsSocket(userId, donationalertsId);
  }
  res.json(req.body);
});


export default app;
