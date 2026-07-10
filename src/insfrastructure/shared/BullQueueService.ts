import { QueueService } from "../../domain/shared/QueueService";
import { Queue } from 'bullmq';
import { environmentService } from "../EnvironmentService";

export class BullQueueService implements QueueService {
    private readonly productEmailQueue: Queue;

    constructor() {
        const { REDIS_URL } = environmentService.get();
        const redisUrl = new URL(REDIS_URL);
        const connection = {
            connection: {
                host: redisUrl.hostname,
                port: Number(redisUrl.port)
            },
        }
        this.productEmailQueue = new Queue('book-purchased-email', connection);

    }

    async enqueuePurchasedProductEmail(params: { userId: number; bookTitle: string }) {
        await this.productEmailQueue.add('book-purchased-email-job', params);
    }
}