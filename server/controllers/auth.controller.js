import { loginLibrarian, loginUser, registerStudent } from '../services/auth.service.js';

//Login for Librarians 
export async function librarianLogin(req, res) {
    const { id, password } = req.body;
    if (!id || !password) {
        return res.status(400).json({ success: false, message: 'ID and password are required' });
    }

    const result = loginLibrarian(id, password);
    if (!result) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.cookie('token', result.token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ success: true, message: 'Login successful', user: result.user });
}

//Login for Students
export async function studentLogin(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const result = await loginUser(email, password, 'students', 'student');
    if (!result) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.cookie('token', result.token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ success: true, message: 'Login successful', user: result.user });
}

// Registration for Students
export async function studentRegistration(req, res) {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const created = await registerStudent({ name, email, phone, password });
    if (!created) {
        return res.status(409).json({ success: false, message: 'Student already exists' });
    }

    res.status(201).json({ success: true, message: 'Student registered successfully' });
}

export function logout(req, res) {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    });
    res.status(200).json({ success: true, message: 'Logout successful' });
}

