import { Request, Response, NextFunction } from "express";
import { LoginUserUseCase } from "../../../domain/user/use-cases/login-user";
import { PrismaUserRepository } from "../../../insfrastructure/user/repositories/PrismaUserRepository";
import { SecurityServiceImplementation } from "../../../insfrastructure/user/services/SecurityServiceImplementation";


export const loginUserController = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: 'email y password son obligatorios' })
        return;
    }

    const userRepository = new PrismaUserRepository();
    const securityService = new SecurityServiceImplementation();

    const loginUserUseCase = new LoginUserUseCase(userRepository, securityService);

    try {
        const token = await loginUserUseCase.execute({ email, password });
        res.status(200).json({ accessToken: token })
    } catch (error) {
        next(error);
    }
}