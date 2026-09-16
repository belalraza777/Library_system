import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import {
    createRequest,
    listMyRequests,
    listRequests,
    updateRequest,
} from '../controllers/book-record.controller.js';

const router = express.Router();

// Library record routes

// Create a new book request (accessible only by Students)
router.post('/', authenticate, requireRole('student'), createRequest);
// List the logged-in student's own requests
router.get('/my-requests', authenticate, requireRole('student'), listMyRequests);
// List all book requests (accessible only by Librarians)
router.get('/', authenticate, requireRole('librarian'), listRequests);
// Update the status of a book request (accessible only by Librarians)
router.patch('/:id', authenticate, requireRole('librarian'), updateRequest);

export default router;