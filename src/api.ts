import express from 'express';
import { userRouter } from './ui/user/routes/user-route';
import { errorHandlerMiddleware } from './ui/shared/middlewares/error-handler-middleware';
import { booksRouter } from './ui/book/routes/book-router';
import { meRouter } from './ui/book/routes/me-router';


const api = express();

api.use(express.json());
api.use('/authentication', userRouter);
api.use('/me', meRouter);
api.use('/books', booksRouter);
api.use(errorHandlerMiddleware);
export { api };