import { UserRepository } from "../../../domain/user/repositories/UserRepository";
import { CreateUserUseCaseInput } from "../../../domain/user/use-cases/create-user";
import { User } from "../../../domain/user/User";
import prisma from "../../prisma-client";

type PrismaUser = {
    id: number;
    email: string;
    password: string;
    createdAt: Date;
}


export class PrismaUserRepository implements UserRepository {
    private readonly prisma = prisma;
    
    async findByEmail(email: string): Promise<User | null> {
        const prismaUser = await this.prisma.user.findUnique({ 
            where: {
                email,
            }
        })
        
        if (!prismaUser) {
            return null
        } else {
            return this.restore(prismaUser);
        }
    }

    async findById(id: number): Promise<User | null> {
        const prismaUser = await this.prisma.user.findUnique({
            where: {
                id,
            }
        });
        
        if (!prismaUser) {
            return null;
        }

        return this.restore(prismaUser);
    }

    async create(params: CreateUserUseCaseInput) {
        const newUser = await this.prisma.user.create({
            data: {
                email: params.email,
                password: params.password
            }
        })

        return this.restore(newUser);
    }


    private restore(prismaUser: PrismaUser): User {
        return new User({
            id: prismaUser.id,
            email: prismaUser.email,
            password: prismaUser.password,
            createdAt: prismaUser.createdAt
        });
    }
}


