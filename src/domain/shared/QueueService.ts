export interface QueueService {
    enqueuePurchasedProductEmail: (params: { userId: number; bookTitle: string }) => void;
}