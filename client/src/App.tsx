import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import LibrarianDashboard from './pages/Librarian/Dashboard'
import RegisterStudent from './pages/Librarian/RegisterStudent'
import AddCategory from './pages/Librarian/AddCategory'
import AddBook from './pages/Librarian/AddBook'
import LibrarianRequests from './pages/Librarian/RequestsLibrarian'
import StudentDashboard from './pages/Student/Dashboard'
import BookRequest from './pages/Student/BookRequest'
import RequestsStudent from './pages/Student/RequestsStudent'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/librarian"
          element={
            <ProtectedRoute role="librarian">
              <LibrarianDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/librarian/register-student"
          element={
            <ProtectedRoute role="librarian">
              <RegisterStudent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/librarian/categories"
          element={
            <ProtectedRoute role="librarian">
              <AddCategory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/librarian/books"
          element={
            <ProtectedRoute role="librarian">
              <AddBook />
            </ProtectedRoute>
          }
        />
        <Route
          path="/librarian/requests"
          element={
            <ProtectedRoute role="librarian">
              <LibrarianRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/request-book"
          element={
            <ProtectedRoute role="student">
              <BookRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/requests"
          element={
            <ProtectedRoute role="student">
              <RequestsStudent />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

export default App
