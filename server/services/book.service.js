import database from '../config/db.js';

export async function getCategories() {
    const [rows] = await database.promise().query(
        'SELECT id, name FROM categories ORDER BY name',
    );
    return rows;
}

export async function addCategory(name) {
    const [existing] = await database.promise().query(
        'SELECT id FROM categories WHERE name = ?',
        [name],
    );
    if (existing.length) {
        return false;
    }

    await database.promise().query(
        'INSERT INTO categories (name) VALUES (?)',
        [name],
    );
    return true;
}

export async function getBooksByCategory(categoryId) {
    const [rows] = await database.promise().query(
        'SELECT id, book_name, available FROM books WHERE category_id = ? ORDER BY book_name',
        [categoryId],
    );
    return rows;
}

export async function addBook(categoryId, bookName) {
    const [categories] = await database.promise().query(
        'SELECT id FROM categories WHERE id = ?',
        [categoryId],
    );
    if (!categories.length) {
        return false;
    }

    await database.promise().query(
        'INSERT INTO books (category_id, book_name) VALUES (?, ?)',
        [categoryId, bookName],
    );
    return true;
}