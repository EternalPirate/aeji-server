var admin = require("firebase-admin");

var StorageKey = 'queues';
var StorageCollectionKey = 'videoQueue';
var DB = admin.firestore().collection(StorageKey);

module.exports = {
    addQueue: async function(queueItem) {
        var queueType = queueItem.queueType;
        var queueRef = DB.doc(queueType);

        // push to collection new queueItem
        queueRef.collection(StorageCollectionKey).add(queueItem);

        // increment videoQueueLen
        var increment = admin.firestore.FieldValue.increment(1);
        queueRef.set({
            videoQueueLen: increment,
            queueType
        }, { merge: true });
    }
};
