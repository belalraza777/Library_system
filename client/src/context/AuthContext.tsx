import { createContext, useContext, useState, type ReactNode } from 'react'
import { loginLibrarian, loginStudent } from '../api/authApi'
import type {
  AuthUser,
	LibrarianLoginRequest,
	StudentLoginRequest,
} from '../types/auth'

interface AuthContextValue {
	user: AuthUser | null
	isAuthenticated: boolean
	loginLibrarian: (credentials: LibrarianLoginRequest) => Promise<void>
	loginStudent: (credentials: StudentLoginRequest) => Promise<void>
	logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null)

	const handleLibrarianLogin = async (credentials: LibrarianLoginRequest) => {
		const response = await loginLibrarian(credentials)
		setUser(response.user)
	}

	const handleStudentLogin = async (credentials: StudentLoginRequest) => {
		const response = await loginStudent(credentials)
		setUser(response.user)
	}

	const logout = () => {
		setUser(null)
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: user !== null,
				loginLibrarian: handleLibrarianLogin,
				loginStudent: handleStudentLogin,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext)

	if (!context) {
		throw new Error('useAuth must be used inside AuthProvider')
	}

	return context
}
