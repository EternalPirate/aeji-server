"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addQueue = addQueue;

var _index = _interopRequireDefault(require("firebase-admin/lib/index"));

var _serviceAccountKey = _interopRequireDefault(require("../../serviceAccountKey.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_index["default"].initializeApp({
  credential: _index["default"].credential.cert(_serviceAccountKey["default"])
});

var StorageKey = 'queues';
var StorageCollectionKey = 'videoQueue';

var DB = _index["default"].firestore().collection(StorageKey);

function addQueue(queueItem) {
  var queueType = queueItem.queueType;
  var queueRef = DB.doc(queueType); // push to collection new queueItem

  queueRef.collection(StorageCollectionKey).add(queueItem); // increment videoQueueLen

  var increment = _index["default"].firestore.FieldValue.increment(1);

  queueRef.set({
    videoQueueLen: increment,
    queueType: queueType
  }, {
    merge: true
  });
}