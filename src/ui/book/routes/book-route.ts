import { Router } from "express";
import { createBookController } from "../controller/create-book-controller";
import { authenticationMiddleware } from "../../user/middlewares/authentication-middleware";
import { editBookController } from "../controller/edit-book-controller";
import { removeBookController } from "../controller/remove-book-controller";
import { getBooksController } from "../controller/get-books-controller";
import { getMeBooksController } from "../controller/get-me-books-controller";
import { buyBookController } from "../controller/buy-book-controller";


export const booksRouter = Router();

booksRouter.post('/', [authenticationMiddleware, createBookController]);
booksRouter.get('/', getBooksController);
booksRouter.post('/:id/buy', [authenticationMiddleware, buyBookController]);
booksRouter.patch('/:id', [authenticationMiddleware, editBookController]);
booksRouter.delete('/:id', [authenticationMiddleware, removeBookController]);
booksRouter.get('/me', [authenticationMiddleware, getMeBooksController]);