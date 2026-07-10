
import { EntityNotFoundError } from "../../errors/EntityNotFoundError";
import { ForbiddenOperationError } from "../../errors/ForbiddenOperationError";
import { QueueService } from "../../shared/QueueService";
import { BookStatus } from "../Book";
import { BookRepository } from "../repositories/BookRepository";

export interface BuyBookUseCaseInput {
    id: number;
    buyerId: number;
}

export class BuyBookUseCase {
    constructor(
        private readonly bookRepository: BookRepository,
        private readonly queueService: QueueService
    ) { }
    
    async execute(input: BuyBookUseCaseInput) {
        const book = await this.bookRepository.findBookById(input.id);
        
        if (!book) {
            throw new EntityNotFoundError('Book', input.id.toString());
        } else if (input.buyerId === book.ownerId) {
            throw new ForbiddenOperationError('Users cannot buy their own books');
        } else if (book.status !== BookStatus.PUBLISHED) {
            throw new ForbiddenOperationError('Only published books can be purchased.');
        }

        await this.bookRepository.markAsSold(input.id);
        
        this.queueService.enqueuePurchasedProductEmail({
            userId: book.ownerId,
            bookTitle: book.title
        })
    }
}