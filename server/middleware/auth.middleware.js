import { verifyToken } from '../utils/auth.js';

// Middleware to authenticate users based on JWT tokens
export function authenticate(req, res, next) {
    // Check for token in Authorization header or cookies
    const authorization = req?.headers?.authorization;
    const token = authorization?.startsWith('Bearer ')
        ? authorization.slice(7)
        : null;
    
    const cookies = req?.cookies;
    const cookieToken = cookies?.token || null;

    if (!token && !cookieToken) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    const finalToken = token || cookieToken;
    // Verify the token
    try {
        const user = verifyToken(finalToken);
        if (!user) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        req.user = user;
        next();
    } catch {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}

export function requireRole(role) {
    return (req, res, next) => {
        if (req.user?.role !== role) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
}