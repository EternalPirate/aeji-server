import admin from 'firebase-admin/lib/index';
import serviceAccount from '../../serviceAccountKey.json';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const StorageKey = 'queues';
const StorageCollectionKey = 'videoQueue';
const DB = admin.firestore().collection(StorageKey);

export function addQueue(queueItem) {
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
