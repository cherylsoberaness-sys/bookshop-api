import { Book } from "../Book";
import { CreateBookUseCaseInput } from "../use-cases/create-book";
import { EditBookUseCaseInput } from "../use-cases/edit-book";
import { RemoveBookUseCaseInput } from "../use-cases/remove-book";

export interface BookRepository {
    createBook: (params: CreateBookUseCaseInput) => Promise<Book>;
    editBook: (params: EditBookUseCaseInput) => Promise<Book>;
    removeBook: (id: number) => Promise<void>;
    findBookById: (id: number) => Promise<Book | null>;
}