import { Request, Response, NextFunction } from "express"

export const booksController = (req: Request, res: Response, next: NextFunction) => {

    const book = {name:'El acto de crear'} ;

    res.status(200).json({ books: [book] });

    
}


