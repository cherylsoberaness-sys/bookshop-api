import { NextFunction, Request, Response, } from "express";
import { ZodError } from "zod";
import { BusinessConflictError } from "../../../domain/errors/BusinessConflictError";
import { EntityNotFoundError } from "../../../domain/errors/EntityNotFoundError";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError";
import { ForbiddenOperationError } from "../../../domain/errors/ForbiddenOperationError";


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
    } else if (error instanceof EntityNotFoundError) {
        return res.status(404).json({ error: error.message });
    } else if (error instanceof UnauthorizedError){
        return res.status(401).json({ error: error.message });
    } else if (error instanceof ForbiddenOperationError) {
        return res.status(403).json({ error: error.message });
    } else {
        return res.status(500).json({ error: 'Internal server error' });
    }
}