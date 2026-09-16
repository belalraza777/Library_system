import 'dotenv/config';
import mysql from 'mysql2';

const database = mysql.createPool({
	host: process.env.DB_HOST || 'localhost',
	user: process.env.DB_USER || 'root',
	password: process.env.DB_PASSWORD || '',
	database: process.env.DB_NAME || 'library_system',
	waitForConnections: true,
	connectionLimit: 10,
});

export default database;
