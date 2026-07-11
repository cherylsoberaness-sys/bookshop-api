import { EntityNotFoundError } from "../../errors/EntityNotFoundError";
import { ForbiddenOperationError } from "../../errors/ForbiddenOperationError";
import { BookStatus } from "../Book";
import { BookRepository } from "../repositories/BookRepository";


export interface RemoveBookUseCaseInput {
    id: number,
    ownerId: number,
}

export class RemoveUseCase {
    constructor(
        private readonly bookRepository: BookRepository
    ) {};

    async execute(input: RemoveBookUseCaseInput) {
        const book = await this.bookRepository.findBookById(input.id);
        if (!book) {
            throw new EntityNotFoundError('Book', input.id.toString())
        }
        if (input.ownerId !== book.ownerId) {
            throw new ForbiddenOperationError('Only owners can delete their books');
        }
        if (book.status !== BookStatus.PUBLISHED) {
            throw new ForbiddenOperationError('only unsold books can be deleted');
        }

        await this.bookRepository.removeBook(input.id);
    }
}