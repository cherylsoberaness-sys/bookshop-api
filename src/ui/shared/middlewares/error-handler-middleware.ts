import { NextFunction, Request, Response, } from "express";
import { ZodError } from "zod";
import { BusinessConflictError } from "../../../domain/errors/BusinessConflictError";


export const errorHandlerMiddleware = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof ZodError) {
        return res.status(400).json({ error: error.issues[0].message });
    } else if (error instanceof BusinessConflictError) {
        return res.status(409).json({ error: error.message });
    } else {
        return res.status(500).json({ error: 'Internal server error'});
    }
}