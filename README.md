## Bookshop API
---
REST API built for a second hand book marketplace.

## Features

Users can perform the following actions through the API:

- Sign up: `POST /authentication/signup`
- Sign in: `POST /authentication/signin`
  Generates a JWT token if the provided credentials are valid.
- Browse the public catalog: `GET /books`
  - Returns paginated published books.
  - Sold books are excluded from the public catalog.
  - Supports partial search: `GET /books?page=1&limit=10&search=rowling` 

## Authenticated Endpoints

The following endpoints require a valid JWT:

- Create a book: `POST /books`
  - Allowed fields
  ```json
  {
    "title": "Clean Code",
    "description": "Book in excellent condition",
    "price": 20,
    "author": "Robert C. Martin"
  }
  ```
- Edit a book: `PATCH /books/:id`
  - Accepts the same fields as the create endpoint. Any field can be updated independently.
- Buy a book: `POST /books/:id/buy`
- Get my books: `GET /me/books`
  - Returns all books owned by the authenticated user, regardless of their status (`PUBLISHED` or `SOLD`).
- Delete books: `DELETE /books/:id`

## Extra features:
- When a book is sold, a notification email is sent to the owner.
  - Implemented using BullMQ, Redis, Nodemailer and MailDev.
- A weekly cron job checks for books that have not been sold within the last seven days and sends a reminder email
  suggesting the owner lower the price.

---

## Technologies & Concepts

- Hexagonal Architecture
- Domain driven separation between domain, infrastructure and controllers
- Prisma ORM
- PostgreSQL
- Docker
- pgAdmin
- Redis
- BullMQ
- Nodemailer
- MailDev
- JWT Authentication
- Cron Jobs
- Jest (E2E testing)

## Getting Started:

### Clone the repositorie:

```bash
git clone <URL_DEL_REPOSITORIO> 
cd <NOMBRE_DEL_PROYECTO>
```

### Install dependencies:

```bash
npm install
```

### Configure environment variables: 

Create a .env file based on .env.example:

```bash
cp .env.example .env
```

### Start the required services
```bash
docker compose up -d
```

### Run database migrations
```bash
npx prisma migrate dev
```

### Start the application
```
npm start
```



