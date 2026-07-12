import request from 'supertest';
import { api } from '../../api';

export const CREDENTIALS = {
    email: 'validEmail@gmail.com',
    password: 'Valid123@.'
}

export async function createUser(
    overrides: { email?: string, password?: string }
) { 
    const response = await request(api)
    .post('/authentication/signup')
    .send({
      email: CREDENTIALS.email,
      password: CREDENTIALS.password,
      ...overrides,
    });

    if (response.status !== 201) {
        throw new Error(
            `createUser failed with status ${response.status}: ${JSON.stringify(response.body)}`
        );
    }

}