import request from "supertest";
import { api } from '../api';
import { environmentService } from "../insfrastructure/EnvironmentService";
import { prisma } from "./test-utils/prsima-client";
import { BOOKOWNERCREDENTIALS, createBook } from "./test-utils/create-book";
import { createUser } from "./test-utils/create-user";
import { signinUser } from "./test-utils/signing-user";
import { BookStatus } from "../domain/book/Book";

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



describe('POST books/:id/buy', () => {
    test('book purchase happy path', async () => {
        const book = await createBook({});
        await createUser({});
        const token = await signinUser({});

        const response = await request(api)
            .post(`/books/${book.id}/buy`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toEqual(200);
        const soldBook = await prisma.book.findUnique({
            where: {
                id: book.id
            }
        })
        expect(soldBook?.soldAt).not.toBeNull();
        expect(soldBook?.status).toBe(BookStatus.SOLD);
    });

    test('none-existing book purchase throws an error', async () => {
        await createUser({});
        const token = await signinUser({});

        const response = await request(api)
            .post('/books/10000/buy')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toEqual(404);
    });

    test('purchase of a sold book throws an error', async () => {
        const book = await createBook({});
        await createUser({});
        const token = await signinUser({});

        const firstPurchase = await request(api)
            .post(`/books/${book.id}/buy`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(firstPurchase.status).toEqual(200);
        
        const secondPurchase = await request(api)
            .post(`/books/${book.id}/buy`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(secondPurchase.status).toEqual(403);
    });

    test('Buying your own book returns 403', async () => {
        const book = await createBook({});
        await createUser({});
        const token = await signinUser({email: BOOKOWNERCREDENTIALS.email, password: BOOKOWNERCREDENTIALS.password});

        const response = await request(api)
            .post(`/books/${book.id}/buy`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toEqual(403);

    })
})

