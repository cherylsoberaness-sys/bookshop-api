import request from 'supertest';
import { api } from '../api';
import { environmentService } from '../insfrastructure/EnvironmentService';
import { prisma } from './test-utils/prsima-client';
import { createUser } from './test-utils/create-user';
import { signinUser } from './test-utils/signing-user';
import { BookStatus } from '../domain/book/Book';

beforeAll(() => {
    environmentService.load();
});

beforeEach(async () => {
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
});

describe('Post /books', () => {
    const ENDPOINT = '/books'
    test('Given valid data a book is created', async () => {
        await createUser({});
        const token = await signinUser({});

        const response = await request(api)
            .post(ENDPOINT)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Dune',
                description: 'Epic science fiction novel set in a distant future in a feudal interstellar society.',
                price: 30,
                author: 'Frank Herbert',
            });

        expect(response.status).toEqual(201);

        expect(response.body.id).toBeDefined();
        expect(response.body.title).toBe('Dune');
        expect(response.body.description).toBe('Epic science fiction novel set in a distant future in a feudal interstellar society.');
        expect(response.body.price).toBe(30);
        expect(response.body.author).toBe('Frank Herbert');
        expect(response.body.status).toBe(BookStatus.PUBLISHED);
        expect(response.body.ownerId).toBeDefined();
        expect(response.body.soldAt).toBe(null);
        expect(response.body.createdAt).toBeDefined();
  
        const bookId = response.body.id;
        const book = await prisma.book.findUnique({
            where: {
                id: bookId
            }
        });

        expect(book).not.toBeNull();
    });

    test('Having not authenticated credentials a book is not created',
        async () => {
            const response = await request(api)
                .post(ENDPOINT)
                .send({
                    title: 'Dune',
                    description: 'Epic science fiction novel set in a distant future in a feudal interstellar society.',
                    price: 30,
                    author: 'Frank Herbert',
                });
            
            expect(response.status).toEqual(401);
            
            const books = await prisma.book.findMany();
            expect(books).toHaveLength(0);

            const bookId = response.body.id;
            expect(bookId).not.toBeDefined();

    });
    test('Given an invalid token a 401 error is thrown', async () => {
        const response = await request(api)
            .post(ENDPOINT)
            .set('Authorization', 'Bearer dmsdlfkssdfklsajdflsd')
            .send({
                title: 'Dune',
                description: 'Epic science fiction novel set in a distant future in a feudal interstellar society.',
                price: 30,
                author: 'Frank Herbert',
            });
        expect(response.status).toEqual(401);
            
        const books = await prisma.book.findMany();
        expect(books).toHaveLength(0);

        const bookId = response.body.id;
        expect(bookId).not.toBeDefined();
    });
    
    test('Given invalid data an error is thrown', async () => {
        await createUser({});
        const token = await signinUser({});
        
        const response = await request(api)
            .post(ENDPOINT)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Dune',
                description: 'Epic science fiction novel set in a distant future in a feudal interstellar society.',
                price: '30',
                author: 'Frank Herbert',
            });
            
        expect(response.status).toEqual(400);
        expect(response.body.error).toContain('number');
        
        const bookId = response.body.id;
        expect(bookId).not.toBeDefined();

        const books = await prisma.book.findMany();
        expect(books).toHaveLength(0);

    });

    test('An error is returned when title, description, price, or author is not sent', 
        async () => {
            await createUser({});
            const token = await signinUser({});

            const noTitleResponse = await request(api)
                .post(ENDPOINT)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    description: 'Epic science fiction novel set in a distant future in a feudal interstellar society.',
                    price: 30,
                    author: 'Frank Herbert',
                });

            expect(noTitleResponse.status).toEqual(400);

            const noDescriptionResponse = await request(api)
                .post(ENDPOINT)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Dune',
                    price: 30,
                    author: 'Frank Herbert',
                })
            expect(noDescriptionResponse.status).toEqual(400);

            const noPriceResponse = await request(api)
                .post(ENDPOINT)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Dune',
                    description: 'Epic science fiction novel set in a distant future in a feudal interstellar society.',
                    author: 'Frank Herbert',
                })
            expect(noPriceResponse.status).toEqual(400);

            const noAuthorResponse = await request(api)
                .post(ENDPOINT)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Dune',
                    description: 'Epic science fiction novel set in a distant future in a feudal interstellar society.',
                    price: 30
                })
            expect(noAuthorResponse.status).toEqual(400);
        }
    )
});