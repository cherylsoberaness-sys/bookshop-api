import { NextFunction, Request, Response } from "express";
import { PrismaBookRepository } from "../../../insfrastructure/book/repositories/PrismaBookRepository";
import { RemoveUseCase } from "../../../domain/book/use-cases/remove-book";


export const removeBookController = async (req: Request, res: Response, next: NextFunction) => {
    const prismaBookRepository = new PrismaBookRepository();
    const removeBookUseCase = new RemoveUseCase(prismaBookRepository);

    try {
        const id = Number(req.params.id);

        await removeBookUseCase.execute({
            id,
            ownerId: req.userId!
        })

        res.status(204).send();

    } catch (error) {
        next(error);
    }
    
}