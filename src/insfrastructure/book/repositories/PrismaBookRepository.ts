import { Book as PrismaBook } from "@prisma/client";
import { Book, BookStatus } from "../../../domain/book/Book";
import { BookRepository } from "../../../domain/book/repositories/BookRepository";
import { CreateBookUseCaseInput } from "../../../domain/book/use-cases/create-book";
import prisma from "../../prisma-client";
import { EditBookUseCaseInput } from "../../../domain/book/use-cases/edit-book";
import { GetbooksUseCaseInput } from "../../../domain/book/use-cases/get-books";


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
        const book = await this.prisma.book.findUnique({
            where: {
                id,
            }
        });

        if (!book) {
            return null;
        }

        return this.restore(book);
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
            }

        });

        return this.restore(editBook);
    }


    async removeBook(id: number) {
        await this.prisma.book.delete({
            where: {
                id,
            }
        })
    }

    async getBooks(criteria: GetbooksUseCaseInput): Promise<{ books: Book[]; total: number}> {
        const { page, limit } = criteria;

        const search = criteria.search ? {
            OR: [
                { title: { contains: criteria.search, mode: 'insensitive' as const } },
                { description: { contains: criteria.search, mode: 'insensitive' as const } },
                { author: { contains: criteria.search, mode: 'insensitive' as const } }
            ]
        } : undefined;

        const where = {
            ...search,
            status: criteria.excludeSold ?  BookStatus.PUBLISHED : undefined, 
            ownerId: criteria.ownerId
        }


        const [booksDb, booksTotal] = await Promise.all([
            this.prisma.book.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit
            }),
            this.prisma.book.count({ where })
        ]);

        const books = booksDb.map(bookDb => this.restore(bookDb));

        return { 
            books,
            total: booksTotal
        }

    }

    async markAsSold(id: number): Promise<void> {
        await this.prisma.book.update({
            where: {
                id,
            },
            data: {
                status: BookStatus.SOLD,
                soldAt: new Date()
            }

        });
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

