import request from 'supertest';
import { api } from '../api';
import { environmentService } from '../insfrastructure/EnvironmentService'; 
import { prisma } from './test-utils/prsima-client';
import { createUser } from './test-utils/create-user';


beforeAll(() => {
    environmentService.load();
});

beforeEach(async () => {
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe('POST /authentication/signup', () => {
    const ENDPOINT = '/authentication/signup';

    test('Given valid data an user is created', async () => {
        const response = await request(api).post(ENDPOINT).send({
            email: 'pikachu@gmail.com',
            password: 'PikaPikaCHUUUU@95'
        });

        expect(response.status).toEqual(201);

        const createdUser = await prisma.user.findUnique({
            where: {
                email: 'pikachu@gmail.com'
            }
        });

        expect(createdUser).not.toBeNull();
    });

    test('Given a password not strong enough, an error is thrown', async () => {

        const response = await request(api).post(ENDPOINT).send({
            email: 'pikachu@gmail.com',
            password: 'pikachuPwd1'
        })

        expect(response.status).toEqual(400);
       
    });
    
    test('Given an invalid email an error is thrown', async () => {

        const response = await request(api).post(ENDPOINT).send({
            email: 'pikachugmail.com',
            password: 'PikaPikaCHUUUU@95'
        })

        expect(response.status).toEqual(400);
    });

     test('when an existing email an error is thrown', async () => {
        await createUser({});

        const response2 = await request(api).post(ENDPOINT).send({
            email: 'pikachu@gmail.com',
            password: 'PikaPikaCHUUUU@95'
        });

        expect(response2.status).toEqual(409);
    });

    test('when email is not given an error is thrown', async () => {
        const response = await request(api).post(ENDPOINT).send({
            password: 'PikaPikaCHUUUU@95'
        })

        expect(response.status).toEqual(400);
    });

    test('when password is not given an error is thrown', async () => {
        const response = await request(api).post(ENDPOINT).send({
            email: 'pikachugmail.com',
        })

        expect(response.status).toEqual(400);
    });
       
});

