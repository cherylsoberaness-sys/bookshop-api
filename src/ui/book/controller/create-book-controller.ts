import { Request, Response, NextFunction } from "express"
import { PrismaBookRepository } from "../../../insfrastructure/book/repositories/PrismaBookRepository"
import { CreateBookUseCase } from "../../../domain/book/use-cases/create-book";
import { length, z } from 'zod';

const createBookValidationSquema = z.object({
    title: z.string().min(4, "min length for title is 4 characters"),
    description: z.string().min(30, "Min length for description is 30 characters"),
    price: z.number().positive("price can not be negative"),
    author: z.string().min(5)
});


export const createBookController = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    try {
        const { title, description, price, author } = createBookValidationSquema.parse(req.body);


        const prismaBookRepository = new PrismaBookRepository();

        const createBookUseCase = new CreateBookUseCase(prismaBookRepository);
        
        const newBook = await createBookUseCase.execute({
            title,
            description,
            price,
            author,
            ownerId: req.userId!
        });

        res.status(201).json(newBook);
        
    } catch (error) {
        console.log(error);
        next(error);
    }

}


