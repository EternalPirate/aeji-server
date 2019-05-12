"use strict";

var _socket = _interopRequireDefault(require("socket.io-client"));

var _dbQueue = require("./db-queue");

var _urlParser = require("./utils/urlParser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var socket = _socket["default"].connect('wss://socket.donationalerts.ru:443', {
  reconnection: true,
  reconnectionDelayMax: 5000,
  reconnectionDelay: 1000
});

socket.on('connect', function () {
  socket.emit('add-user', {
    token: 'KflrIWcoLbdpkKQbvrWG',
    type: 'alert_widget'
  });
});
var counter = 0;
socket.on('donation', function (msg) {
  var newDonation = JSON.parse(msg);

  if (newDonation) {
    // TODO: remove after tests
    counter++;
    newDonation.amount = counter;
    newDonation.message = '[https://youtu.be/oFElsHvWxn0?t=6058, x1] some text';
    var videoStr = newDonation.message.match(/\[([^)]+)\]/gm)[0];

    if (videoStr) {
      // remove brackets
      videoStr = videoStr.replace(/[\[\]']+/g, '');
      var videoArr = videoStr.split(',');
      var youtubeUrl = videoArr[0];
      var queueType = videoArr[1].trim(); // convert youtube link tu embedded link

      var url = (0, _urlParser.toYouTubeEmbedded)(youtubeUrl);
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
      (0, _dbQueue.addQueue)(newVideoObj);
    }
  }
});