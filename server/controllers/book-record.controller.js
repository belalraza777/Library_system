import {
    createBookRequest,
    datesAreValid,
    getBookRequests,
    getStudentBookRequests,
    updateBookRequest,
} from '../services/book-record.service.js';

//Create a new book request (accessible only by Students)
export async function createRequest(req, res) {
    const { book_id: bookId, from_date: fromDate, to_date: toDate } = req.body;
    if (!bookId || !datesAreValid(fromDate, toDate)) {
        return res.status(400).json({ message: 'Valid book_id, from_date, and to_date are required' });
    }

    const result = await createBookRequest(req.user.id, bookId, fromDate, toDate);
    if (result === 'NOT_FOUND') {
        return res.status(404).json({ message: 'Book not found' });
    }
    if (result === 'UNAVAILABLE') {
        return res.status(409).json({ message: 'Book is currently unavailable' });
    }

    res.status(201).json({ message: 'Book request submitted successfully' });
}

// List all book requests (accessible only by Librarians)
export async function listRequests(req, res) {
    res.json(await getBookRequests());
}

// List the logged-in student's own requests.
export async function listMyRequests(req, res) {
    res.json(await getStudentBookRequests(req.user.id));
}

// Update the status of a book request (accessible only by Librarians)
export async function updateRequest(req, res) {
    const { status, reason } = req.body;
    if (!['ACCEPTED', 'REJECTED'].includes(status.toUpperCase())) {
        return res.status(400).json({ message: 'Status must be ACCEPTED or REJECTED' });
    }
    if (status === 'REJECTED' && !reason?.trim()) {
        return res.status(400).json({ message: 'Reason is required when rejecting a request' });
    }

    const result = await updateBookRequest(req.params.id, status.toUpperCase(), reason?.trim());
    if (result === 'NOT_FOUND') {
        return res.status(404).json({ message: 'Library record not found' });
    }
    if (result === 'PROCESSED') {
        return res.status(409).json({ message: 'Request has already been processed' });
    }
    if (result === 'UNAVAILABLE') {
        return res.status(409).json({ message: 'Book is currently unavailable' });
    }

    res.json({ message: status === 'ACCEPTED' ? 'Book request accepted' : 'Book request rejected' });
}