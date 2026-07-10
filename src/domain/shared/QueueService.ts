export interface QueueService {
    enqueueBookPurchasedEmail: (params: { ownerId: number; bookTitle: string, bookId: number }) => void;
    enqueuePriceReductionEmail: (params: { ownerId: number; bookTitle: string, bookId: number }) => void;
}