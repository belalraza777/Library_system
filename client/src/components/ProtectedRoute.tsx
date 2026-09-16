import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import type { AuthUser } from '../types/auth'

interface ProtectedRouteProps {
  role: AuthUser['role']
  children: ReactNode
}

// ProtectedRoute component to protect routes based on user authentication and role
function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== role) {
    return <Navigate to={`/${user.role}`} replace />
  }

  return children
}

export default ProtectedRoute