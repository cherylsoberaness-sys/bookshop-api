import request from 'supertest';
import { api } from '../api';
import { environmentService } from '../insfrastructure/EnvironmentService'; 
import { prisma } from './test-utils/prsima-client';
import { createUser, CREDENTIALS } from './test-utils/create-user';


beforeAll(() => {
    environmentService.load();
});

beforeEach(async () => {
    await prisma.user.deleteMany();
});

afterAll(async () => {
    await prisma.$disconnect();
});


describe('POST /authentication/signin', () => {
    const ENDPOINT = '/authentication/signin';
    test('Given valid data a JWT is generated', async () => {
        await createUser({});

        const response = await request(api).post(ENDPOINT).send({
            email: CREDENTIALS.email,
            password: CREDENTIALS.password
        });

        expect(response.status).toEqual(200);
        expect(response.body.accessToken).toBeDefined();
    });

    test('Given a none-existing user, throw an error', async () => {

        const response = await request(api).post(ENDPOINT).send({
            email: 'noneExistinEmail@.gmail.com',
            password: CREDENTIALS.password
        });

        expect(response.status).toEqual(404);
        expect(response.body.accessToken).not.toBeDefined();
    });

    test('Given not valid password, throw an error', async () => {
        await createUser({});

        const response = await request(api).post(ENDPOINT).send({
            email: CREDENTIALS.email,
            password: 'randomPassword2'
        });

        expect(response.status).toEqual(401);
        expect(response.body.accessToken).not.toBeDefined();
    });

    test('not given a password throw an error', async () => {
        const response = await request(api).post(ENDPOINT).send({
            email: CREDENTIALS.email,
        });

        expect(response.status).toEqual(400);
        expect(response.body.accessToken).not.toBeDefined();
    });

    test('not given an email throw an error', async () => {
        const response = await request(api).post(ENDPOINT).send({
            password: CREDENTIALS.password,
        });

        expect(response.status).toEqual(400);
        expect(response.body.accessToken).not.toBeDefined();
    });
    

});