# Library System

Full-stack library management system with a React/TypeScript client and an Express/MySQL server.

## Features

- **Librarian:** login, register students, create categories, add books, and manage requests.
- **Student:** login, browse books, request books, and view request status.

## Structure

```text
client/  React + TypeScript + Vite frontend
server/  Express + MySQL backend
```

Client code contains API modules, authentication context, protected routes, pages, and TypeScript types. Server code contains routes, controllers, services, middleware, database configuration, and SQL schema.

## Setup

Requirements: Node.js, npm, and MySQL.

Create the database:

```bash
cd server
mysql -u root -p < schema/schema.sql
```

Create `server/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_system
JWT_SECRET=your_secret
LIBRARIAN_ID=your_id
LIBRARIAN_PASSWORD=your_password
CLIENT_ORIGIN=http://localhost:5173
```

Start the server and client in separate terminals:

```bash
cd server && npm install && node index.js
cd client && npm install && npm run dev
```

Server: `http://localhost:5000`  
Client: `http://localhost:5173`  
API base: `http://localhost:5000/api`

## Client Pages

| Route | Access | Purpose |
|---|---|---|
| `/login` | Public | Student or librarian login |
| `/librarian` | Librarian | Dashboard |
| `/librarian/register-student` | Librarian | Register a student |
| `/librarian/categories` | Librarian | Manage categories |
| `/librarian/books` | Librarian | Add books |
| `/librarian/requests` | Librarian | Accept or reject requests |
| `/student` | Student | Dashboard |
| `/student/request-book` | Student | Request a book |
| `/student/requests` | Student | View request history |

## API

Authentication uses JWTs in an HTTP-only cookie. Protected requests use `withCredentials`; role access is enforced by the server and `ProtectedRoute` on the client.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/librarian/login` | Public | Librarian login |
| POST | `/auth/student/login` | Public | Student login |
| POST | `/students` | Librarian | Register student |
| GET/POST | `/categories` | Both / Librarian | List or create categories |
| GET/POST | `/books` | Both / Librarian | List or add books |
| POST | `/library-records` | Student | Create book request |
| GET | `/library-records/my-requests` | Student | View own requests |
| GET | `/library-records` | Librarian | View all requests |
| PATCH | `/library-records/:id` | Librarian | Accept or reject request |

## Database Schema

Defined in `server/schema/schema.sql`:

- `students`: student accounts and hashed passwords.
- `categories`: unique book categories.
- `books`: books linked to categories and marked available/unavailable.
- `library_records`: student requests, dates, status, and rejection reason.

Categories contain books; students create library records; books are referenced by library records. Statuses are `PENDING`, `ACCEPTED`, `REJECTED`, and `RETURNED`.

## Main Flow

1. User logs in as a student or librarian.
2. Server validates credentials and creates an HTTP-only JWT cookie.
3. Client redirects to the role-specific dashboard.
4. Students submit requests with a book and date range.
5. Librarians accept or reject pending requests.
6. Students view the updated request status.

## Development Commands

```bash
cd client
npm run dev
npm run build
npm run lint
```

```bash
cd server
node index.js
```