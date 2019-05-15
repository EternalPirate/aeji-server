import errorHandler from 'errorhandler';
import express from 'express';
const cors = require('cors');

import app from './app';

/**
 * Error Handler. Provides full stack - remove for production
 */
app.set('port', 3000);
app.use(errorHandler());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4200'
}));

/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), () => {
  console.log(
    app.get('port'),
    app.get('env')
  );
  console.log('Press CTRL-C to stop');
});

export default server;
