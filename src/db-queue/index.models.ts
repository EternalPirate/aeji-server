export interface IQueueItem {
    id: number;
    message: string;
    username: string;
    amount: number;
    currency: string;
    date_created: string;
    url: string;
    queueType: string;
}
