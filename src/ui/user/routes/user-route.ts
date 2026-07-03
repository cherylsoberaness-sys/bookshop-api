import { Router } from 'express';
import { registerUserController } from '../controller/registerUserController';

export const userRouter = Router();

userRouter.post('/signup', registerUserController);