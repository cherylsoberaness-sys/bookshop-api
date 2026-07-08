import { Book } from "../Book";
import { CreateBookUseCaseInput } from "../use-cases/create-book";
import { EditBookUseCaseInput } from "../use-cases/edit-book";
import { GetbooksUseCaseInput } from "../use-cases/get-books";


export interface BookRepository {
    createBook: (params: CreateBookUseCaseInput) => Promise<Book>;
    editBook: (params: EditBookUseCaseInput) => Promise<Book>;
    removeBook: (id: number) => Promise<void>;
    findBookById: (id: number) => Promise<Book | null>;
    getBooks: (criteria: GetbooksUseCaseInput) => Promise<{ books: Book[]; total: number }>;
    markAsSold: (id: number) => Promise<void>;
}