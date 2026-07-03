import { User } from '../User';

export interface UserRepository {
    create: (params: { email: string, password: string }) => Promise<User>;
    findByEmail: (email: string) => Promise<User | null>;
}