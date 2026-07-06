import { Book as PrismaBook } from "@prisma/client";
import { Book, BookStatus } from "../../../domain/book/Book";
import { BookRepository } from "../../../domain/book/repositories/BookRepository";
import { CreateBookUseCaseInput } from "../../../domain/book/use-cases/create-book";
import prisma from "../../prisma-client";
import { EditBookUseCaseInput } from "../../../domain/book/use-cases/edit-book";


export class PrismaBookRepository implements BookRepository {
    private readonly prisma = prisma;

    async createBook(params: CreateBookUseCaseInput): Promise<Book> {
        const newBook = await this.prisma.book.create({
            data: {
                title: params.title,
                description: params.description,
                price: params.price,
                author: params.author,
                ownerId: params.ownerId
            }

            
        });
        


        return this.restore(newBook);

    }

    async findBookById(id: number): Promise<Book | null> {
        const book = this.prisma.book.findUnique({
            where: {
                id,
            }
        })

        return book;
    }

    async editBook(params: EditBookUseCaseInput): Promise<Book> {
        const editBook = await this.prisma.book.update({
            where: {
              id: params.id,  
            },
            data: {
                title: params.title,
                description: params.description,
                price: params.price,
                author: params.author,
                ownerId: params.ownerId
            }

        });

        return this.restore(editBook);
    }

    private restore(prismaBook: PrismaBook): Book {
        return new Book({
            id: prismaBook.id,
            title: prismaBook.title,
            description: prismaBook.description,
            price: prismaBook.price,
            author: prismaBook.author,
            status: prismaBook.status as BookStatus,
            ownerId: prismaBook.ownerId,
            soldAt: prismaBook.soldAt,
            createdAt: prismaBook.createdAt

        })
    }
    
}

