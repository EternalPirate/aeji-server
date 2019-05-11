const admin = require("firebase-admin");

const StorageKey = 'queues';
const StorageCollectionKey = 'videoQueue';
const DB = admin.firestore().collection(StorageKey);

module.exports = {
    addQueue: async function(queueItem) {
        const queueType = queueItem.queueType;
        const queueRef = DB.doc(queueType);

        // push to collection new queueItem
        queueRef.collection(StorageCollectionKey).add(queueItem);

        // increment videoQueueLen
        const increment = admin.firestore.FieldValue.increment(1);
        queueRef.set({
            videoQueueLen: increment,
            queueType
        }, { merge: true });
    }
};
