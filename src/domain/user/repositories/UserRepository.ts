import { CreateUserUseCaseInput } from '../use-cases/create-user';
import { User } from '../User';

export interface UserRepository {
    create: (params: CreateUserUseCaseInput) => Promise<User>;
    findByEmail: (email: string) => Promise<User | null>;
    findById: (id: number) => Promise<User | null>;
}