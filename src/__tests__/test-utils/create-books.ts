import  request  from "supertest";
import { createBook } from "./create-book";
import { createUser } from "./create-user";
import { signinUser } from "./signing-user";
import { api } from "../../api";




export const createBooks = async () => {
    const book1 = await createBook({
        title: "The Hobbit",
        description: "A fantasy novel about Bilbo Baggins embarking on an unexpected journey with a group of dwarves.",
        price: 25,
        author: "J.R.R. Tolkien"
    }, { email: 'user0@gmail.com', password: 'validPwd0#' });

    const book2 = await createBook({
        title: "1984",
        description: "A dystopian novel depicting a totalitarian society under constant surveillance.",
        price: 18,
        author: "George Orwell"
    }, {email: 'user1@gmail.com', password: 'validPwd1#'});

    const book3 = await createBook({
        title: "Pride and Prejudice",
        description: "A classic novel that explores love, class, and social expectations in 19th-century England.",
        price: 22,
        author: "Jane Austen"
    }, {email: 'user2@gmail.com', password: 'validPwd2#'});

    const book4 = await createBook({
        title: "The Martian",
        description: "A science fiction novel following an astronaut stranded on Mars as he struggles to survive.",
        price: 28,
        author: "Andy Weir"
    }, {email: 'user3@gmail.com', password: 'validPwd3#'});

    return [book1, book2, book3, book4];
}

export const createSoldAndPublishedBooks = async () => {
    await createUser({})
    const token = await signinUser({})
    const books = await createBooks();

    const secondBookPurchased = await request(api)
        .post(`/books/${books[1].id}/buy`)
        .set('Authorization', `Bearer ${token}`);
    
    const thirdBookPurchased = await request(api)
        .post(`/books/${books[2].id}/buy`)
        .set('Authorization', `Bearer ${token}`);
    
    if (secondBookPurchased.status !== 200 || thirdBookPurchased.status !== 200) {
        throw new Error(`Buying test books failed. Statuses: 
            ${secondBookPurchased.status}, 
            ${thirdBookPurchased.status}`
        )
    }

}

