import express from 'express';
import cookieParser from 'cookie-parser';
import database from './config/db.js';
import { errorHandler } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import bookRoutes from './routes/book.routes.js';
import libraryRecordRoutes from './routes/library-record.routes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', bookRoutes);
app.use('/api/library-records', libraryRecordRoutes);


// Check that the database is reachable
database.query('SELECT 1', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database');
    }
});

//Routes
app.get('/health', (req, res) => {
	res.json({ status: 'ok', message: 'Library System API is running' });
});

app.all('/{*splat}', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

//Error handling middleware
app.use(errorHandler);


// Start the server
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
