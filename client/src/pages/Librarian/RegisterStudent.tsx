import { useState } from 'react'
import axios from 'axios'
import { registerStudent } from '../../api/authApi'

export default function RegisterStudent() {
  const [student, setStudent] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input changes
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value
    }));
  }

  // Handle form submission
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(''); 
    try {
      const response = await registerStudent(student);
      if (response.success) {
        setStudent({
          name: '',
          email: '',
          phone: '',
          password: '',
        });
        alert('Student registered successfully!');
      }else {
        setError('Failed to register student. Please try again.');
      }
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ?? 'Failed to register student. Please try again.'
        : 'Failed to register student. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
    <form className="form register-student-form" method="post" onSubmit={handleSubmit}>
      <h1>Register New Student</h1>
      {error && <p className="error" role="alert">{error}</p>}
      <label htmlFor="student-name">
        Student Name:
        <input
          id="student-name"
          type="text"
          name="name"
          value={student.name}
          onChange={handleChange}
          autoComplete="name"
          required
        />
      </label>
      <label htmlFor="student-email">
        Student Email:
        <input 
          id="student-email"
          type="email"
          name="email"
          value={student.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
      </label>
      <label htmlFor="student-phone">
        Student Phone:
        <input 
          id="student-phone"
          type="text"
          name="phone"
          value={student.phone}
          onChange={handleChange}
          autoComplete="tel"
          required
        />
      </label>
      <label htmlFor="student-password">
        Create Password:
        <input 
          id="student-password"
          type="password"
          name="password"
          value={student.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register New Student'}
      </button>
    </form>
    </main>
  )
}
