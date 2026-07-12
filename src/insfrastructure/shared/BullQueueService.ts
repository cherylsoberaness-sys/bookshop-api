import { QueueService } from "../../domain/shared/QueueService";
import { Queue } from 'bullmq';
import { environmentService } from "../EnvironmentService";

export class BullQueueService implements QueueService {
    private readonly bookPurchasedEmailQueue: Queue;
    private readonly priceReductionSuggestionEmailQueue: Queue;

    constructor() {
        const { REDIS_URL } = environmentService.get();
        const redisUrl = new URL(REDIS_URL);
        const connection = {
            connection: {
                host: redisUrl.hostname,
                port: Number(redisUrl.port)
            },
        }
        this.bookPurchasedEmailQueue = new Queue('book-purchased-email', connection);
        this.priceReductionSuggestionEmailQueue = new Queue('price-reduction-suggestion-email', connection);
    }

    async enqueueBookPurchasedEmail(params: { ownerId: number; bookTitle: string; bookId: number }) {
        await this.bookPurchasedEmailQueue.
            add('book-purchased-email-job', params);
    }

    async enqueuePriceReductionEmail(params: { ownerId: number; bookTitle: string; bookId: number }) {
        await this.priceReductionSuggestionEmailQueue.
            add('price-reduction-suggestion-email-job', params);
    }

}