import admin from 'firebase-admin/lib/index';
import serviceAccount from '../../serviceAccountKey.json';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const StorageKey = 'queues';
const StorageCollectionKey = 'list';

export function addQueue(userId, queueItem) {
    const queueType = queueItem.queueType;
    const queueRef = admin.firestore()
        .collection('users')
        .doc(userId)
        .collection(StorageKey)
        .doc(queueType);

    // push to collection new queueItem
    queueRef.collection(StorageCollectionKey).add(queueItem);

    // increment videoQueueLen
    const increment = admin.firestore.FieldValue.increment(1);
    queueRef.set({
        videoQueueLen: increment,
        queueType
    }, { merge: true });
}

export async function getUsers() {
    const docs = await admin.firestore().collection('users').listDocuments();

    return Promise.all(docs.map(async user => {
        const userData = await user.get();

        return userData.data();
    }));
}
