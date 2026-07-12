import { Router } from "express";
import { authenticationMiddleware } from "../../user/middlewares/authentication-middleware";
import { getMeBooksController } from "../controller/get-me-books-controller";

export const meRouter = Router();

meRouter.get('/books', [authenticationMiddleware, getMeBooksController]);