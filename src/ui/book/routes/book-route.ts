import { Router } from "express";
import { createBookController } from "../controller/create-book-controller";
import { authenticationMiddleware } from "../../user/middlewares/authentication-middleware";
import { editBookController } from "../controller/edit-book-controller";
import { removeBookController } from "../controller/remove-book-controller";
import { getBooksController } from "../controller/get-books-controller";
import { getMeBooksController } from "../controller/get-me-books-controller";


export const booksRouter = Router();

booksRouter.post('/', [authenticationMiddleware, createBookController]);
booksRouter.patch('/:id', [authenticationMiddleware, editBookController]);
booksRouter.delete('/:id', [authenticationMiddleware, removeBookController]);
booksRouter.get('/', getBooksController);
booksRouter.get('/me', [authenticationMiddleware, getMeBooksController]);