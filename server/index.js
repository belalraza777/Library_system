import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import database from './config/db.js';
import { errorHandler } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import bookRoutes from './routes/book.routes.js';
import libraryRecordRoutes from './routes/library-record.routes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

//Middleware
app.use(cors({
    origin: clientOrigin,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Routes
app.get('/', (req, res) => {
    res.json({ success: true, message: 'Welcome to the Library System API' });
});
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
    res.json({ success: true, status: 'ok', message: 'Library System API is running' });
});

app.all('/{*splat}', (req, res) => {
    res.status(404).json({
        success: false,
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
