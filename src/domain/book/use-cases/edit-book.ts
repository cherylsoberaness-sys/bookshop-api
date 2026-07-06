import { EntityNotFoundError } from "../../errors/EntityNotFoundError";
import { ForbiddenOperationError } from "../../errors/ForbiddenOperationError";
import { Book } from "../Book";
import { BookRepository } from "../repositories/BookRepository";


export interface EditBookUseCaseInput {
    id: number;
    title?: string;
    description?: string;
    price?: number;
    author?: string;
    ownerId: number;
}

export class EditBookUseCase {
    constructor(
        private readonly bookRepository: BookRepository,
    ) { }
    
    async execute(input: EditBookUseCaseInput): Promise<Book> {
        const book = await this.bookRepository.findBookById(input.id);
        if (!book) {
            throw new EntityNotFoundError('Book', input.id.toString());
        }
        if (input.ownerId !== book.ownerId) {
            throw new ForbiddenOperationError('Only owners can update their books');
        }

        if (input.price !== undefined && input.price < 0) {
            throw new Error('Price can not be negative');
        }

        const editedBook = await this.bookRepository.editBook(input);

        return editedBook;
    }
}