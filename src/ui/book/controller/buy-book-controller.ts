import { Request, Response, NextFunction } from "express";
import { PrismaBookRepository } from "../../../insfrastructure/book/repositories/PrismaBookRepository";
import { BuyBookUseCase } from "../../../domain/book/use-cases/buy-book";


export const buyBookController = async (req: Request, res: Response, next: NextFunction) => {
    const prismaBookRepository = new PrismaBookRepository();
    const buyBookUseCase = new BuyBookUseCase(prismaBookRepository);

    try {
        const id = Number(req.params.id);
        await buyBookUseCase.execute({
            id,
            ownerId: req.userId!
        });
        res.status(200).json({
            message: "Book purchased succesfully"
        });
    } catch (error) {
        next(error);
    }
    
}