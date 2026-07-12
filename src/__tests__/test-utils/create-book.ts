import request from 'supertest';
import { api } from '../../api';
import { createUser } from './create-user';
import { signinUser } from './signing-user';


const BOOKPROPERTIES = {
    title: 'Dune',
    description: 'Epic science fiction novel set in a distant future in a feudal interstellar society.',
    price: 30,
    author: 'Frank Herbert',
}

export const BOOKOWNERCREDENTIALS = {
    email: 'bookCreatedOwner@gmail.com',
    password: 'AnotherValidPwd4$'    
}


export async function createBook(overrides: { title?: string, description?: string, price?: number, author?: string }) {
    await createUser({ email: BOOKOWNERCREDENTIALS.email, password: BOOKOWNERCREDENTIALS.password });
    const token = await signinUser({ email: BOOKOWNERCREDENTIALS.email, password: BOOKOWNERCREDENTIALS.password });

    const response =
        await request(api)
            .post('/books')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: BOOKPROPERTIES.title,
                description: BOOKPROPERTIES.description,
                price: BOOKPROPERTIES.price,
                author: BOOKPROPERTIES.author,
                ...overrides
            });

    if (response.status !== 201) {
        throw new Error(`createBook failed with status ${response.status}: ${JSON.stringify(response.body)}`);
    }

    return response.body;
    
}