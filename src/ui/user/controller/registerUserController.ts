import { NextFunction, Request, Response } from "express";
import { CreateUserUseCase } from "../../../domain/user/use-cases/create-user";
import { PrismaUserRepository } from "../../../insfrastructure/user/repositories/PrismaUserRepository";
import { SecurityServiceImplementation } from "../../../insfrastructure/user/services/SecurityServiceImplementation";



export const registerUserController = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400).json({ error: 'email y password son obligatorios' })
        return;
    }

    const securityService = new SecurityServiceImplementation();
    const prismaUserRepository = new PrismaUserRepository();
    
    const createUserUseCase = new CreateUserUseCase(
        prismaUserRepository,
        securityService
    )

    try { 
        await createUserUseCase.execute({
            email,
            password
        })
        res.status(201).json({
            message: 'User created successfully'
        });
    } catch (error) {
        next(error);
    }
}