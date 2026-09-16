import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
	const { user, logout } = useAuth()
	const navigate = useNavigate()

	if (!user) {
		return null
	}

	const handleLogout = () => {
		logout()
		navigate('/login', { replace: true })
	}

	return (
		<nav className="navbar">
			<NavLink to={`/${user.role}`}>
				Dashboard
			</NavLink>

			{user.role === 'librarian' ? (
				<>
					<NavLink to="/librarian/register-student">Register student</NavLink>
					<NavLink to="/librarian/categories">Categories</NavLink>
					<NavLink to="/librarian/books">Books</NavLink>
					<NavLink to="/librarian/requests">Requests</NavLink>
				</>
			) : (
				<>
					<NavLink to="/student/request-book">Request a book</NavLink>
					<NavLink to="/student/requests">My requests</NavLink>
				</>
			)}

			<button type="button" onClick={handleLogout}>
				Logout
			</button>
		</nav>
	)
}
