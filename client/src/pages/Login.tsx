
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { loginLibrarian, loginStudent } = useAuth();
  const navigate = useNavigate();

  const [isStudentLogin, setIsStudentLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Student
  const [email, setEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");

  // Librarian
  const [id, setId] = useState("");
  const [librarianPassword, setLibrarianPassword] = useState("");

  // Handle Student Login
  async function studentLoginSubmit() {
    setLoading(true);
    setError("");

    try {
      await loginStudent({
        email,
        password: studentPassword,
      });

      navigate("/student");
    } catch {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  // Handle Librarian Login
  async function librarianLoginSubmit() {
    setLoading(true);
    setError("");

    try {
      await loginLibrarian({
        id,
        password: librarianPassword,
      });

      navigate("/librarian");
    } catch {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  function switchLoginType(student: boolean) {
    setIsStudentLogin(student);
    setError("");
  }

  return (
    <div className="login-page">
      <h1>Choose Login Type</h1>

      <div className="login-switcher">
      <button type="button" onClick={() => switchLoginType(true)}>
        Login as Student
      </button>

      <button type="button" onClick={() => switchLoginType(false)}>
        Login as Librarian
      </button>
      </div>

      {error && <p className="error">{error}</p>}

      {isStudentLogin ? (
        <div className="login-form">
          <h2>Student Login</h2>

          <label>
            Email
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Password"
              value={studentPassword}
              onChange={(e) => setStudentPassword(e.target.value)}
              required
            />
          </label>

          <button
            onClick={studentLoginSubmit}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      ) : (
        <div className="login-form">
          <h2>Librarian Login</h2>

          <label>
            ID
            <input
              type="text"
              placeholder="ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Password"
              value={librarianPassword}
              onChange={(e) => setLibrarianPassword(e.target.value)}
              required
            />
          </label>

          <button
            onClick={librarianLoginSubmit}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      )}
    </div>
  );
}

