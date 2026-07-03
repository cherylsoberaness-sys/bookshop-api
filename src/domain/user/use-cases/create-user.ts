import { UserRepository } from "../repositories/UserRepository";
import { z } from 'zod';
import { SecurityService } from "../services/SecurityService";

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
        
        this.validateEmail(input.email);

        this.validatePassword(input.password);

        const existingUser = await this.userRepository.findByEmail(input.email);

        if (existingUser) {
            throw new Error('An user with that email already exists');
        }

        const hashedPassword = await this.securityService.hash(input.password);

        const newUser = await this.userRepository.create({
            email: input.email,
            password: hashedPassword
        })

        return newUser

    }

    private validateEmail(email: string) {
        const result = emailValidationSchema.safeParse(email);
        
        if (!result.success) {
            throw new Error('EMAIL_INVALID');
        }
    }

    private validatePassword(password: string) {
        const result = passwordValidationSchema.safeParse(password);

        if (!result.success) {
            throw new Error('PASSWORD_INVALID');
        }
    }

}