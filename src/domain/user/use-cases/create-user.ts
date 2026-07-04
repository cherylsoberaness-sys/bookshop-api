import { UserRepository } from "../repositories/UserRepository";
import { z } from 'zod';
import { SecurityService } from "../services/SecurityService";
import { BusinessConflictError } from "../../errors/BusinessConflictError";

const passwordValidationSchema = z
    .string()
    .min(8)
    .max(20)
    .regex(/[a-z]/)
    .regex(/[A-Z]/)
    .regex(/\d/)
    .regex(/[\W_]/)

const emailValidationSchema = z.email();

export interface CreateUserUseCaseInput {
    email: string;
    password: string;
}

export class CreateUserUseCase {
    private readonly userRepository: UserRepository;
    private readonly securityService: SecurityService;

    constructor(userRepository: UserRepository, securityService: SecurityService) {
        this.userRepository = userRepository;
        this.securityService = securityService;
    }

    async execute(input: CreateUserUseCaseInput) {
        
        emailValidationSchema.parse(input.email);

        passwordValidationSchema.parse(input.password);

        const existingUser = await this.userRepository.findByEmail(input.email);

        if (existingUser) {
            throw new BusinessConflictError('An user with that email already exists');
        }

        const hashedPassword = await this.securityService.hash(input.password);

        const newUser = await this.userRepository.create({
            email: input.email,
            password: hashedPassword
        })

        return newUser

    }      

}