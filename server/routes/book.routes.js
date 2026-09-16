import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import {
	createBook,
	createCategory,
	listBooks,
	listCategories,
} from '../controllers/book.controller.js';

const router = express.Router();

// Book routes

// List all categories
router.get('/categories', authenticate, listCategories);
// Add a new category (accessible only by Librarians)
router.post('/categories', authenticate, requireRole('librarian'), createCategory);
// List all books in a category
router.get('/books', authenticate, listBooks);
// Add a new book (accessible only by Librarians)
router.post('/books', authenticate, requireRole('librarian'), createBook);

export default router;