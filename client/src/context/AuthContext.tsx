import { createContext, useContext, useState, type ReactNode } from 'react'
import { loginLibrarian, loginStudent, logoutUser } from '../api/authApi'
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
	logout: () => Promise<void>
}

// Create the AuthContext with an initial value of undefined
const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(() => {
		const storedUser = localStorage.getItem('user')

		if (!storedUser) {
			return null
		}

		try {
			return JSON.parse(storedUser) as AuthUser
		} catch {
			localStorage.removeItem('user')
			return null
		}
	})

    // Function to handle librarian login
	const handleLibrarianLogin = async (credentials: LibrarianLoginRequest) => {
		const response = await loginLibrarian(credentials)
		setUser(response.user)
		localStorage.setItem('user', JSON.stringify(response.user))
	}

    // Function to handle student login
	const handleStudentLogin = async (credentials: StudentLoginRequest) => {
		const response = await loginStudent(credentials)
		setUser(response.user)
		localStorage.setItem('user', JSON.stringify(response.user))
	}

    // Function to handle logout
	const logout = async () => {
		await logoutUser()
		setUser(null)
		localStorage.removeItem('user')
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

// Custom hook to use the AuthContext
export function useAuth() {
	const context = useContext(AuthContext)

	if (!context) {
		throw new Error('useAuth must be used inside AuthProvider')
	}

	return context
}
