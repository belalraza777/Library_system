import {
    addBook,
    addCategory,
    getBooksByCategory,
    getCategories,
} from '../services/book.service.js';

// List all categories
export async function listCategories(req, res) {
    res.json({ success: true, data: await getCategories() });
}

// Add a new category (accessible only by Librarians)
export async function createCategory(req, res) {
    const { name } = req.body;
    if (!name?.trim()) {
        return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const created = await addCategory(name.trim());
    if (!created) {
        return res.status(409).json({ success: false, message: 'Category already exists' });
    }

    res.status(201).json({ success: true, message: 'Category added successfully' });
}

// List all books in a category
export async function listBooks(req, res) {
    const { categoryId } = req.query;
    if (!categoryId || !Number.isInteger(Number(categoryId))) {
        return res.status(400).json({ success: false, message: 'categoryId is required' });
    }

    res.json({ success: true, data: await getBooksByCategory(categoryId) });
}

// Add a new book (accessible only by Librarians)
export async function createBook(req, res) {
    const { category_id: categoryId, book_name: bookName } = req.body;
    if (!categoryId || !bookName?.trim()) {
        return res.status(400).json({ success: false, message: 'category_id and book_name are required' });
    }

    const created = await addBook(categoryId, bookName.trim());
    if (created === 'CATEGORY_NOT_FOUND') {
        return res.status(404).json({ success: false, message: 'Category not found' });
    }
    if (created === 'BOOK_EXISTS') {
        return res.status(409).json({ success: false, message: 'Book already exists' });
    }

    res.status(201).json({ success: true, message: 'Book added successfully' });
}