import { DocumentData } from '@google-cloud/firestore';
import { IQueueItem } from './index.models';
import admin from 'firebase-admin/lib/index';
const serviceAccount = require('../../serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const StorageKey = 'queues';
const StorageCollectionKey = 'list';

export async function addQueue(userId: string, queueItem: IQueueItem) {
    const queueType = queueItem.queueType;
    const queueRef = admin.firestore()
        .collection('users')
        .doc(userId)
        .collection(StorageKey)
        .doc(queueType);


    // push to collection new queueItem
    await queueRef.collection(StorageCollectionKey).add(queueItem);

    // get real size of the list
    const size = (await queueRef.collection(StorageCollectionKey).get()).size;

    // update videoQueueLen
    queueRef.set({
        videoQueueLen: size,
        queueType
    }, { merge: true });
}

export async function getUsers(): Promise<DocumentData[]> {
    const docs = await admin.firestore().collection('users').listDocuments();

    return Promise.all(docs.map(async user => {
        const userData = await user.get();

        return userData.data();
    }));
}
