import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'change-this-secret-in-production';

// Hash a password with bcrypt before storing it.
export function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}

// Compare a login password with the stored bcrypt hash.
export function verifyPassword(password, storedPassword) {
    return bcrypt.compareSync(password, storedPassword);
}

// Create a JWT token with the given payload.
export function createToken(payload) {
    return jwt.sign(payload, jwtSecret);
}

// Verify a JWT token and return the decoded payload if valid.
export function verifyToken(token) {
    return jwt.verify(token, jwtSecret);
}