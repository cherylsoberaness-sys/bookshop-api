import { EntityNotFoundError } from "../../errors/EntityNotFoundError";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { UserRepository } from "../repositories/UserRepository";
import { SecurityService } from "../services/SecurityService";


export interface LoginUserUseCaseInput {
    email: string;
    password: string;
}

export class LoginUserUseCase {
    private readonly userRepository: UserRepository;
    private readonly securityService: SecurityService;

    constructor(userRepository: UserRepository, securityService: SecurityService) {
        this.userRepository = userRepository;
        this.securityService = securityService;
    }

    async execute(input: LoginUserUseCaseInput) {
        const user = await this.userRepository.findByEmail(input.email);
        if (!user) {
            throw new EntityNotFoundError('User', input.email);
        }

        const rightPassword = await this.securityService.comparePasswords(input.password, user.password);
        if (!rightPassword) {
            throw new UnauthorizedError('Wrong Password');
        }

        const token = this.securityService.generateJwt(user.id);

        
        return token;

    }

     

}