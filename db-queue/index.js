const admin = require("firebase-admin");

const StorageKey = 'queues';
const StorageCollectionKey = 'videoQueue';
const DB = admin.firestore().collection(StorageKey);

module.exports = {
    addQueue: function(queueItem) {
        const queueType = queueItem.queueType;
        const queueRef = DB.doc(queueType);
        const increment = admin.firestore.FieldValue.increment(1);

        // push to collection new queueItem
        queueRef.collection(StorageCollectionKey).add(queueItem);
        // create an empty document, or do nothing if it exists.
        queueRef.set({}, { merge: true });
        // increment videoQueueLen
        queueRef.update({
            videoQueueLen: increment,
            queueType
        });
    }
};
