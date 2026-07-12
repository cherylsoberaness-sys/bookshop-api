import request from 'supertest';
import { api } from '../api';
import { environmentService } from '../insfrastructure/EnvironmentService'; 
import { prisma } from './test-utils/prisma-client';
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
            email: 'ed@gmail.com',
            password: 'edHasValidPwd#1'
        });

        expect(response.status).toEqual(201);

        const createdUser = await prisma.user.findUnique({
            where: {
                email: 'ed@gmail.com'
            }
        });

        expect(createdUser).not.toBeNull();
    });

    test('Given a password not strong enough, an error is thrown', async () => {

        const response = await request(api).post(ENDPOINT).send({
            email: 'valid@gmail.com',
            password: 'invalidPwd1'
        })

        expect(response.status).toEqual(400);
       
    });
    
    test('Given an invalid email an error is thrown', async () => {

        const response = await request(api).post(ENDPOINT).send({
            email: 'validgmail.com',
            password: 'Valid123@.'
        })

        expect(response.status).toEqual(400);
    });

     test('when an existing email an error is thrown', async () => {
        await createUser({});

        const response2 = await request(api).post(ENDPOINT).send({
            email: 'validEmail@gmail.com',
            password: 'Valid123@.'
        });

        expect(response2.status).toEqual(409);
    });

    test('when email is not given an error is thrown', async () => {
        const response = await request(api).post(ENDPOINT).send({
            password: 'Valid123@.'
        })

        expect(response.status).toEqual(400);
    });

    test('when password is not given an error is thrown', async () => {
        const response = await request(api).post(ENDPOINT).send({
            email: 'valid@gmail.com',
        })

        expect(response.status).toEqual(400);
    });
       
});

