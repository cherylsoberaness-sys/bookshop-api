import { NextFunction, Request, Response } from "express";
import { PrismaBookRepository } from "../../../insfrastructure/book/repositories/PrismaBookRepository";
import { GetBooksUseCase } from "../../../domain/book/use-cases/get-book";
import { z } from "zod";

const getBookQueryParamsSchemaValidator = z.object({
    page: z.coerce.number().positive().default(1),
    limit: z.coerce.number().positive().max(100).default(10),
})


export const getMeBooksController = async (req: Request, res: Response, next: NextFunction) => {

    const prismaBookRepository = new PrismaBookRepository();
    const getBooksUseCase = new GetBooksUseCase(prismaBookRepository);

    const userId = Number(req.userId);

    try {
        const { page, limit } = getBookQueryParamsSchemaValidator.parse(req.query);
        const books = await getBooksUseCase.execute({ 
            page,
            limit,
            ownerId: userId
        });

        res.status(200).json(books);
    } catch (error) {
        next(error);
    } 

}