import database from '../config/db.js';

// Validate date format (YYYY-MM-DD) and ensure it's a valid calendar date
function isValidDate(date) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		return false;
	}
	const parsedDate = new Date(`${date}T00:00:00Z`);
	return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().startsWith(date);
}
// Validate that fromDate and toDate are valid and that fromDate is not after toDate
export function datesAreValid(fromDate, toDate) {
	return isValidDate(fromDate) && isValidDate(toDate) && fromDate <= toDate;
}


// Create a new book request [accessible only by Students]
export async function createBookRequest(studentId, bookId, fromDate, toDate) {
	const connection = await database.promise().getConnection();

	try {
		await connection.beginTransaction(); // Start a transaction for atomicity between checking availability and inserting the request.

		// Lock the book while checking availability to prevent double booking.
		const [books] = await connection.query(
			'SELECT id, available FROM books WHERE id = ? FOR UPDATE',
			[bookId],
		);

		if (!books.length) {
			await connection.rollback();
			return 'NOT_FOUND';
		}

		if (!books[0].available) {
			await connection.rollback();
			return 'UNAVAILABLE';
		}

		await connection.query(
			`INSERT INTO library_records
			 (student_id, book_id, from_date, to_date)
			 VALUES (?, ?, ?, ?)`,
			[studentId, bookId, fromDate, toDate],
		);

		await connection.commit();
		return 'CREATED';
	} catch (error) {
		await connection.rollback();
		throw error;
	} finally {
		connection.release();
	}
}

// Fetch all book requests [accessible only by Librarians]
export async function getBookRequests() {
	const [rows] = await database.promise().query(
        'SELECT * FROM library_records ORDER BY created_at DESC',
	);

	return rows;
}

// Fetch only the logged-in student's book requests.
export async function getStudentBookRequests(studentId) {
	const [rows] = await database.promise().query(
        'SELECT * FROM library_records WHERE student_id = ? ORDER BY created_at DESC',
		[studentId],
	);

	return rows;
}

// Update the status of a book request [accessible only by Librarians]
export async function updateBookRequest(recordId, status, reason) {
	const connection = await database.promise().getConnection();

	try {
		await connection.beginTransaction(); // Start a transaction to ensure atomicity between checking the record status, updating the book availability, and updating the request status.

		const [records] = await connection.query(
			'SELECT id, book_id, status FROM library_records WHERE id = ? FOR UPDATE',
			[recordId],
		);

		if (!records.length) {
			await connection.rollback();
			return 'NOT_FOUND';
		}

		if (records[0].status !== 'PENDING') {
			await connection.rollback();
			return 'PROCESSED';
		}

		if (status === 'ACCEPTED') {
			const [books] = await connection.query(
				'SELECT available FROM books WHERE id = ? FOR UPDATE',
				[records[0].book_id],
			);

			if (!books.length || !books[0].available) {
				await connection.rollback();
				return 'UNAVAILABLE';
			}

			await connection.query(
				'UPDATE books SET available = FALSE WHERE id = ?',
				[records[0].book_id],
			);
		}

		await connection.query(
			'UPDATE library_records SET status = ?, reason = ? WHERE id = ?',
			[status, status === 'REJECTED' ? reason : null, recordId],
		);

		await connection.commit();
		return 'UPDATED';
	} catch (error) {
		await connection.rollback();
		throw error;
	} finally {
		connection.release();
	}
}
