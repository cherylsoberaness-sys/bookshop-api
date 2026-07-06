import { Book } from "../Book";
import { CreateBookUseCaseInput } from "../use-cases/create-book";
import { EditBookUseCaseInput } from "../use-cases/edit-book";

export interface BookRepository {
    createBook: (params: CreateBookUseCaseInput) => Promise<Book>;
    editBook: (params: EditBookUseCaseInput) => Promise<Book>; 
    findBookById: (id: number) => Promise<Book | null>;
}