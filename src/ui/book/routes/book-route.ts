import { Router } from "express";
import { createBookController } from "../controller/create-book-controller";
import { authenticationMiddleware } from "../../user/middlewares/authentication-middleware";
import { editBookController } from "../controller/edit-book-controller";


export const booksRouter = Router();

booksRouter.post('/', [authenticationMiddleware, createBookController]);
booksRouter.patch('/:id', [authenticationMiddleware, editBookController]);