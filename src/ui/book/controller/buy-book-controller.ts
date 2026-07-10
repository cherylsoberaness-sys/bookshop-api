import { Request, Response, NextFunction } from "express";
import { PrismaBookRepository } from "../../../insfrastructure/book/repositories/PrismaBookRepository";
import { BuyBookUseCase } from "../../../domain/book/use-cases/buy-book";
import { BullQueueService } from "../../../insfrastructure/shared/BullQueueService";


export const buyBookController = async (req: Request, res: Response, next: NextFunction) => {
    const prismaBookRepository = new PrismaBookRepository();
    const queueService = new BullQueueService();
    const buyBookUseCase = new BuyBookUseCase(prismaBookRepository, queueService);

    try {
        const id = Number(req.params.id);
        await buyBookUseCase.execute({
            id,
            buyerId: req.userId!
        });
        res.status(200).json({
            message: "Book purchased succesfully"
        });
    } catch (error) {
        next(error);
    }
    
}