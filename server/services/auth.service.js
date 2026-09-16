import database from '../config/db.js';
import { createToken, hashPassword, verifyPassword } from '../utils/auth.js';

//Login a user (student or librarian) and return a JWT token if successful.
export async function loginUser(email, password, table, role) {
    const [rows] = await database.promise().query(
        `SELECT id, email, password FROM ${table} WHERE email = ?`,
        [email],
    );

    if (!rows[0] || !verifyPassword(password, rows[0].password)) {
        return null;
    }

    return createToken({ id: rows[0].id, email: rows[0].email, role });
}

//Login a librarian and return a JWT token if successful.
export function loginLibrarian(id, password) {
    if (
        String(id) !== String(process.env.LIBRARIAN_ID) ||
        password !== process.env.LIBRARIAN_PASSWORD
    ) {
        return null;
    }

    return createToken({
        id: process.env.LIBRARIAN_ID,
        role: 'librarian',
    });
}

//Register a new student and return true if successful.
export async function registerStudent({ name, email, phone, password }) {
    const [existing] = await database.promise().query(
        'SELECT id FROM students WHERE email = ?',
        [email],
    );
    if (existing.length) {
        return false;
    }

    await database.promise().query(
        'INSERT INTO students (name, email, phone, password) VALUES (?, ?, ?, ?)',
        [name, email, phone || null, hashPassword(password)],
    );
    return true;
}