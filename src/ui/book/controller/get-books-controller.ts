import { NextFunction, Request, Response } from "express";
import { PrismaBookRepository } from "../../../insfrastructure/book/repositories/PrismaBookRepository";
import { GetBooksUseCase } from "../../../domain/book/use-cases/get-book";
import { Book } from "../../../domain/book/Book";
import { z } from "zod";
import { PaginatedResponse } from "../../shared/types/PaginatedResponse";

const getBookQueryParamsSchemaValidator = z.object({
    page: z.coerce.number().positive().default(1),
    limit: z.coerce.number().positive().max(100).default(10),
})


export const getBooksController = async (req: Request, res: Response, next: NextFunction) => {

    const prismaBookRepository = new PrismaBookRepository();
    const getBooksUseCase = new GetBooksUseCase(prismaBookRepository);

    try {
        const { page, limit } = getBookQueryParamsSchemaValidator.parse(req.query);
        const { books, total } = await getBooksUseCase.execute({ 
            page,
            limit
        });

        const response: PaginatedResponse<Book> = {
            data: books,
            meta: {
                page,
                limit,
                total
            }
        }

        res.status(200).json(response);
    } catch (error) {
        next(error);
    } 

}