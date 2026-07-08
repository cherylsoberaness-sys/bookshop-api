import { NextFunction, Request, Response } from "express";
import { PrismaBookRepository } from "../../../insfrastructure/book/repositories/PrismaBookRepository";
import { GetBooksUseCase } from "../../../domain/book/use-cases/get-books";
import { PaginatedResponse } from "../../shared/types/PaginatedResponse";
import { Book } from "../../../domain/book/Book";
import { z } from "zod";

const getBookQueryParamsSchemaValidator = z.object({
    page: z.coerce.number().positive().default(1),
    limit: z.coerce.number().positive().max(100).default(10),
    search: z.string().min(3).optional(),
})


export const getMeBooksController = async (req: Request, res: Response, next: NextFunction) => {

    const prismaBookRepository = new PrismaBookRepository();
    const getBooksUseCase = new GetBooksUseCase(prismaBookRepository);

    const userId = Number(req.userId);

    try {
        const { page, limit, search } = getBookQueryParamsSchemaValidator.parse(req.query);
        const { books, total } = await getBooksUseCase.execute({ 
            page,
            limit,
            ownerId: userId,
            excludeSold: false,
            search
        });

        const response: PaginatedResponse<Book> = {
        data: books,
        meta: {
                limit,
                page,
                total,
            },
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    } 

}