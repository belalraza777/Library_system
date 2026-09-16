import {
    addBook,
    addCategory,
    getBooksByCategory,
    getCategories,
} from '../services/book.service.js';

// List all categories
export async function listCategories(req, res) {
    res.json(await getCategories());
}

// Add a new category (accessible only by Librarians)
export async function createCategory(req, res) {
    const { name } = req.body;
    if (!name?.trim()) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    const created = await addCategory(name.trim());
    if (!created) {
        return res.status(409).json({ message: 'Category already exists' });
    }

    res.status(201).json({ message: 'Category added successfully' });
}

// List all books in a category
export async function listBooks(req, res) {
    const { categoryId } = req.query;
    if (!categoryId || !Number.isInteger(Number(categoryId))) {
        return res.status(400).json({ message: 'categoryId is required' });
    }

    res.json(await getBooksByCategory(categoryId));
}

// Add a new book (accessible only by Librarians)
export async function createBook(req, res) {
    const { category_id: categoryId, book_name: bookName } = req.body;
    if (!categoryId || !bookName?.trim()) {
        return res.status(400).json({ message: 'category_id and book_name are required' });
    }

    const created = await addBook(categoryId, bookName.trim());
    if (!created) {
        return res.status(404).json({ message: 'Category not found' });
    }

    res.status(201).json({ message: 'Book added successfully' });
}