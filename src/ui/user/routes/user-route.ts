import { Router } from 'express';
import { registerUserController } from '../controller/registerUserController';
import { loginUserController } from '../controller/login-user-controller';

export const userRouter = Router();

userRouter.post('/signup', registerUserController);
userRouter.post('/signin', loginUserController);