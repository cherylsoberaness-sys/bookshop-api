import request from 'supertest';
import { api } from '../../api';

export const CREDENTIALS = {
    email: 'pikachu@gmail.com',
    password: 'PikaPikaCHUUUU@95'
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

    if (response.status != 201) {
        throw new Error(
            `createUser falló con status ${response.status}: ${JSON.stringify(response.body)}`
        );
    }

}