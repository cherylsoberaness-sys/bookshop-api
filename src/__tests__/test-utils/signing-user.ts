import request from 'supertest';
import { api } from '../../api';
import { email } from 'zod';


export const CREDENTIALS = {
    email: 'pikachu@gmail.com',
    password: 'PikaPikaCHUUUU@95'
}


export async function signinUser(
    overrides: {email?: string, password?: string}
) {
    const response = await request(api).
        post('/authentication/signin').
        send({
            email: CREDENTIALS.email,
            password: CREDENTIALS.password,
            ...overrides,
    
        });
    
    if (response.status != 200) {
        throw new Error(
            `signin user failed with status ${response.status}: ${JSON.stringify(response.body)}`
        );
    }
    
    return response.body.accessToken;
    
}