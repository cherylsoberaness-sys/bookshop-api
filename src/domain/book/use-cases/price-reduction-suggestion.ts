import { QueueService } from "../../shared/QueueService";
import { BookRepository } from "../repositories/BookRepository";

export interface PriceReductionSuggestionUseCaseInput {
    date: Date;
}

export class PriceReductionSuggestionUseCase {
    constructor(
        private readonly bookRepository: BookRepository,
        private readonly queueService: QueueService
    ) { }

    async execute(input: PriceReductionSuggestionUseCaseInput) {
        const books = await this.bookRepository.FindPublishedBooksOlderThan(input.date);

        books.forEach(book => {
                this.queueService.enqueuePriceReductionEmail({
                    ownerId: book.ownerId,
                    bookTitle: book.title,
                    bookId: book.id
            });
            
        });
    }
    
}