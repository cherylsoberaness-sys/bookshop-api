## API REST built for a buying and selling of second hand books platform.
---

Actions users can perform via the API:

- Signup: POST /authentication/signup
- Signin: POST /authentication/signin --> this generates a JWT token for authentication,
  if the credentials are valid.
- Get paginated published books from the catalog (sold books are excluded).
- Partial search: GET /books?page=1&limit=10&search=rowling 

The following actions are allowed with a JWT authentication:

- Create a book: POST /books:

  Allowed fields:
  { 
   "title": "Clean Code", 
   "description": "Libro en perfecto estado", 
   "price": 20, 
   "author": "Robert C. Martin" 
  }
- Edit a book: PATCH /books/:id
  Allowed fields are the same of creating a book.
- Buy a book: POST /books/:id/buy
- Get books from an authenticated user: GET /me/books ---> Returns all the books from an authenticated user
  regardless of the status (PUBLISHED/SOLD).
- Delete books: DELETE /books/:id

Extra actions implementated:
 

- When a book is sold an notification is sent to the book's owner. This is implementated using queues from 'bullmq', Redis, nodemailer
  and Maildev to simulate the email delivering.
- Once a week, a cron job checks for books that haven't been sold in the last seven days and sends a notification to the owner
  suggesting to lower the price.
---

### Key Takeaways

- Implementation of hexagonal architecture for the doamin decoupling from infrastructure usage.
- Differences between domain, infrastructure, controller logic responsibilities and similar flows.
- Use of queues or distributed events and their differences.
- Implemantation of Prisma, Docker and pgAdmin for the DB administration.
- Cron jobs.
- Testing with jest.

## How to execute the project:

Clone the repositorie:

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```

Install dependencies:

```bash
npm install
```

Configure env variables: create a .env file at the root of the project based on .env.example:

```bash
cp .env.example .env
```

Execute the project:

```bash
docker compose up -d   
npx prisma migrate dev
npm start
```



