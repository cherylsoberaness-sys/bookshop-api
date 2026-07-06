import { EntityNotFoundError } from "../../errors/EntityNotFoundError";
import { ForbiddenOperationError } from "../../errors/ForbiddenOperationError";
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

        await this.bookRepository.removeBook(input.id);
    }
}