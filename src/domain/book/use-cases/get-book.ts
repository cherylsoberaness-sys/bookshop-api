import { BookRepository } from "../repositories/BookRepository";
import { Book } from "../Book";
import { Pagination } from "../../shared/Pagination";

export interface BooksFilter {
    excludeSold?: boolean;
    ownerId?: number;
    search?: string;
}

export type GetbooksUseCaseInput = Pagination & BooksFilter;

export class GetBooksUseCase {
    constructor(
        private readonly bookRepository: BookRepository
    ) {

    }

    async execute(criteria: GetbooksUseCaseInput): Promise<{ books: Book[]; total: number }> {
        
        const { books, total }  = await this.bookRepository.getBooks(criteria);
        return {
            books,
            total
        }
        
    }
}