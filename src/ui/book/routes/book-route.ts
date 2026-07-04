import { Router } from "express";
import { booksController } from "../controller/book-controller";
import { authenticationMiddleware } from "../../user/middlewares/authentication-middleware";


export const booksRouter = Router();

booksRouter.get('/', [authenticationMiddleware, booksController]);