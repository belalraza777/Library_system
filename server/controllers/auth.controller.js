import { loginLibrarian, loginUser, registerStudent } from '../services/auth.service.js';

//Login for Librarians 
export async function librarianLogin(req, res) {
    const { id, password } = req.body;
    if (!id || !password) {
        return res.status(400).json({ message: 'ID and password are required' });
    }

    const token = loginLibrarian(id, password);
    if (!token) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ message: 'Login successful', token });
}

//Login for Students
export async function studentLogin(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const token = await loginUser(email, password, 'students', 'student');
    if (!token) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ message: 'Login successful', token });
}

// Registration for Students
export async function studentRegistration(req, res) {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const created = await registerStudent({ name, email, phone, password });
    if (!created) {
        return res.status(409).json({ message: 'Student already exists' });
    }

    res.status(201).json({ message: 'Student registered successfully' });
}

