import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { PrismaBookRepository } from "../../../insfrastructure/book/repositories/PrismaBookRepository";
import { EditBookUseCase, EditBookUseCaseInput } from "../../../domain/book/use-cases/edit-book";

const editBookValidationSquema = z.object({
    title: z.string().min(4, "min length for title is 4 characters").optional(),
    description: z.string().min(30, "Min length for description is 30 characters").optional(),
    price: z.number().positive("price can not be negative").optional(),
    author: z.string().min(5).optional()
});

export const editBookController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const { title, description, price, author } = editBookValidationSquema.parse(req.body);

        const prismaBookRepository = new PrismaBookRepository();
        const editBookUseCase = new EditBookUseCase(prismaBookRepository);

        const editParams: Partial<EditBookUseCaseInput> = {};

        if (title !== undefined) {
            editParams.title = title;
        }
        if (description !== undefined) {
            editParams.description = description;
        }
        if (price !== undefined) {
            editParams.price = price;
        }
        if (author !== undefined) {
            editParams.author = author;
        }


        const book = await editBookUseCase.execute({
            id,
            ...editParams,
            ownerId: req.userId!,
        })

        res.status(200).json(book);

    } catch (error) {
        next(error);
    }
    

} 