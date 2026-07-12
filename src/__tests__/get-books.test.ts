import request from "supertest";
import { api } from "../api";
import { environmentService } from "../insfrastructure/EnvironmentService";
import { prisma } from "./test-utils/prisma-client";
import { createBooks, createSoldAndPublishedBooks } from "./test-utils/create-books";
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


describe('GET /books', () => {
    test('get paginated response of books', async () => {
        await createBooks();
        const response = await request(api).get('/books');

        expect(response.status).toEqual(200);
        expect(response.body.meta.page).toBeDefined();
        expect(response.body.data).toHaveLength(4);

    });

    test('Get matching paginated response', async () => {
        await createBooks();

        const response = await request(api).get('/books?page=2&limit=2');

        expect(response.body.data).toHaveLength(2);
        expect(response.body.meta.page).toBe(2);
        expect(response.body.meta.limit).toBe(2);
        expect(response.body.meta.total).toBe(4);
    });

    test('Returns books matching a partial title search and status 200', async () => {
        await createBooks();
        const response = await request(api).get('/books?search=pride');

        expect(response.status).toEqual(200);
        expect(response.body.meta.page).toBeDefined();
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0].title).toBe('Pride and Prejudice');
    });

    test('Returns books matching a partial author search and status 200', async () => {
        await createBooks();
        const response = await request(api).get('/books?search=Tolkien');

        expect(response.status).toEqual(200);
        expect(response.body.meta.page).toBeDefined();
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0].author).toBe('J.R.R. Tolkien');
    });

    test('Get books excluding the sold ones', async () => {
        await createSoldAndPublishedBooks();

        const response = await request(api).get('/books');

        expect(response.body.data).toHaveLength(2);
        expect(response.body.data.every((book: any) => book.status === BookStatus.PUBLISHED)).toBe(true);
    });

});