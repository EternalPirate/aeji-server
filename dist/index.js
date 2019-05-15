"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _initSocket = require("./views/init-socket");

var _dbQueue = require("./db-queue");

var app = (0, _express["default"])();
var port = 3000;
app.use(_express["default"].json());
app.use((0, _cors["default"])({
  origin: 'http://localhost:4200'
}));
var activeUsers = new Set();
(0, _dbQueue.getUsers)().then(function (users) {
  if (users && users.length > 0) {
    users.forEach(function (userData) {
      var settings = userData.settings;
      var user = userData.user;

      if (user.id && settings.donationalertsId && !activeUsers.has(user.id)) {
        activeUsers.add(user.id);
        new _initSocket.DonationAlertsSocket(user.id, settings.donationalertsId);
      } else {
        console.error('User have no required data');
      }
    });
  } else {
    console.error('No users found');
  }
});
app.post('/settings', function (req, res) {
  var donationalertsId = req.body.settings.donationalertsId;
  var userId = req.body.userId;

  if (userId && donationalertsId && !activeUsers.has(userId)) {
    activeUsers.add(userId);
    new _initSocket.DonationAlertsSocket(userId, donationalertsId);
  }

  res.json(req.body);
});
app.listen(port, function () {
  return console.log("App listening on port ".concat(port, "!"));
});