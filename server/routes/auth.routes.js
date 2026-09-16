import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import {
	librarianLogin,
	studentLogin,
	studentRegistration,
} from '../controllers/auth.controller.js';

const router = express.Router();

// Auth routes

// Login route for Librarians
router.post('/auth/librarian/login', librarianLogin);
// Login route for Students
router.post('/auth/student/login', studentLogin);
// Registration route for Students (accessible only by Librarians)
router.post('/students', authenticate, requireRole('librarian'), studentRegistration);

export default router;