# Library System Server

Backend API for the Library Management System.

## Technologies

- Node.js
- Express.js
- MySQL
- `bcryptjs` for password hashing
- `jsonwebtoken` for JWT authentication
- `cookie-parser` for cookie tokens

## Folder Structure

```text
server/
├── config/          Database connection
├── controllers/     Request and response handling
├── middleware/      Authentication and error handling
├── routes/          API routes
├── services/        Database and business logic
├── schema/          MySQL schema
├── utils/           Password hashing and JWT functions
└── index.js         Server entry point
```

## Setup

From the `server` folder, install dependencies:

```bash
npm install
```

Create the database:

```bash
mysql -u root -p < schema/schema.sql
```

Create `.env` in the `server` folder:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=library_system
JWT_SECRET=your_long_random_secret
LIBRARIAN_ID=1
LIBRARIAN_PASSWORD=123456
```

Start the server:

```bash
node index.js
```

Server URL: `http://localhost:5000`

Health check:

```http
GET /health
```

## Authentication

Login returns a JWT token. Send it in the request header:

```http
Authorization: Bearer YOUR_TOKEN
```

The server also accepts a cookie named `token`.

Available roles:

- `librarian`: manage students, categories, books, and book requests
- `student`: view categories/books and create book requests

## API Endpoints

All protected endpoints require authentication.

| Method | Endpoint | Role | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/librarian/login` | Public | Librarian login |
| `POST` | `/api/auth/student/login` | Public | Student login |
| `POST` | `/api/students` | Librarian | Register a student |
| `GET` | `/api/categories` | Student/Librarian | Get categories |
| `POST` | `/api/categories` | Librarian | Create a category |
| `GET` | `/api/books?categoryId=1` | Student/Librarian | Get books by category |
| `POST` | `/api/books` | Librarian | Add a book |
| `POST` | `/api/library-records` | Student | Create a book request |
| `GET` | `/api/library-records/my-requests` | Student | View own request statuses |
| `GET` | `/api/library-records` | Librarian | View book requests |
| `PATCH` | `/api/library-records/:id` | Librarian | Accept or reject a request |

## Request Examples

### Login

Librarian login uses the fixed ID and password from `.env`. Student login uses the registered email and password.

Librarian login body:

```json
{
  "id": 1,
  "password": "123456"
}
```

```json
{
  "email": "student@gmail.com",
  "password": "123456"
}
```

### Register student

```json
{
  "name": "Belal Raza",
  "email": "belal@gmail.com",
  "phone": "9876543210",
  "password": "123456"
}
```

### Create category

```json
{
  "name": "Science"
}
```

### Add book

```json
{
  "category_id": 1,
  "book_name": "Science 1"
}
```

New books are available by default.

### Create book request

```json
{
  "book_id": 1,
  "from_date": "2026-09-20",
  "to_date": "2026-09-27"
}
```

The student ID comes from the JWT. New requests have status `PENDING`.

### Accept request

```json
{
  "status": "ACCEPTED"
}
```

### Reject request

```json
{
  "status": "REJECTED",
  "reason": "Book is already reserved"
}
```

A rejection requires a reason. Accepting a request makes the book unavailable.

## Common Status Codes

- `200` Success
- `201` Created
- `400` Invalid or missing data
- `401` Authentication required or invalid token
- `403` Not allowed for this role
- `404` Resource not found
- `409` Duplicate, unavailable, or already processed resource
- `500` Server error
