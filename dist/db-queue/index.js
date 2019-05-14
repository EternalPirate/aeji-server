"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addQueue = addQueue;
exports.getUsers = getUsers;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _index = _interopRequireDefault(require("firebase-admin/lib/index"));

var _serviceAccountKey = _interopRequireDefault(require("../../serviceAccountKey.json"));

_index["default"].initializeApp({
  credential: _index["default"].credential.cert(_serviceAccountKey["default"])
});

var StorageKey = 'queues';
var StorageCollectionKey = 'list';

function addQueue(userId, queueItem) {
  var queueType = queueItem.queueType;

  var queueRef = _index["default"].firestore().collection('users').doc(userId).collection(StorageKey).doc(queueType); // push to collection new queueItem


  queueRef.collection(StorageCollectionKey).add(queueItem); // increment videoQueueLen

  var increment = _index["default"].firestore.FieldValue.increment(1);

  queueRef.set({
    videoQueueLen: increment,
    queueType: queueType
  }, {
    merge: true
  });
}

function getUsers() {
  return _getUsers.apply(this, arguments);
}

function _getUsers() {
  _getUsers = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2() {
    var docs;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _index["default"].firestore().collection('users').listDocuments();

          case 2:
            docs = _context2.sent;
            return _context2.abrupt("return", Promise.all(docs.map(
            /*#__PURE__*/
            function () {
              var _ref = (0, _asyncToGenerator2["default"])(
              /*#__PURE__*/
              _regenerator["default"].mark(function _callee(user) {
                var userData;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return user.get();

                      case 2:
                        userData = _context.sent;
                        return _context.abrupt("return", userData.data());

                      case 4:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x) {
                return _ref.apply(this, arguments);
              };
            }())));

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getUsers.apply(this, arguments);
}