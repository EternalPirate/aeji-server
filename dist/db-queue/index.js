"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("firebase-admin/lib/index"));
const serviceAccount = require('../../serviceAccountKey.json');
index_1.default.initializeApp({
    credential: index_1.default.credential.cert(serviceAccount)
});
const StorageKey = 'queues';
const StorageCollectionKey = 'list';
function addQueue(userId, queueItem) {
    return __awaiter(this, void 0, void 0, function* () {
        const queueType = queueItem.queueType;
        const queueRef = index_1.default.firestore()
            .collection('users')
            .doc(userId)
            .collection(StorageKey)
            .doc(queueType);
        // push to collection new queueItem
        const x = yield queueRef.collection(StorageCollectionKey).add(queueItem);
        console.log(x);
        // get real size of the list
        const size = (yield queueRef.collection(StorageCollectionKey).get()).size;
        // increment videoQueueLen
        queueRef.set({
            videoQueueLen: size + 1,
            queueType
        }, { merge: true });
    });
}
exports.addQueue = addQueue;
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const docs = yield index_1.default.firestore().collection('users').listDocuments();
        return Promise.all(docs.map((user) => __awaiter(this, void 0, void 0, function* () {
            const userData = yield user.get();
            return userData.data();
        })));
    });
}
exports.getUsers = getUsers;
//# sourceMappingURL=index.js.map