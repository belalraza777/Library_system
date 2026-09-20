import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
	const { user, logout } = useAuth()
	const navigate = useNavigate()
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	if (!user || !user.role ) {
		return null
	}

	const handleLogout = async () => {
		await logout()
		navigate('/login', { replace: true })
	}

	const closeMenu = () => setIsMenuOpen(false)

	return (
		<nav className="navbar">
			<div className="navbar-header">
				<div className='brand-logo'>LIBRARY SYSTEM</div>
				<button
					className="navbar-toggle"
					type="button"
					aria-expanded={isMenuOpen}
					aria-controls="navbar-menu"
					onClick={() => setIsMenuOpen((open) => !open)}
				>
					<span />
					<span />
					<span />
					<span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
				</button>
			</div>

			<div id="navbar-menu" className={`navbar-menu${isMenuOpen ? ' is-open' : ''}`}>
				<div className="navbar-links">
					<NavLink to={`/${user.role}`} onClick={closeMenu}>Dashboard</NavLink>

					{user.role === 'librarian' ? (
						<>
							<NavLink to="/librarian/register-student" onClick={closeMenu}>Register student</NavLink>
							<NavLink to="/librarian/categories" onClick={closeMenu}>Categories</NavLink>
							<NavLink to="/librarian/books" onClick={closeMenu}>Books</NavLink>
							<NavLink to="/librarian/requests" onClick={closeMenu}>Requests</NavLink>
						</>
					) : (
						<>
							<NavLink to="/student/request-book" onClick={closeMenu}>Request a book</NavLink>
							<NavLink to="/student/requests" onClick={closeMenu}>My requests</NavLink>
						</>
					)}
				</div>

				<div className="navbar-actions">
					<span className={`navbar-role navbar-role-${user.role}`}>
						{user.role === 'librarian' ? 'Librarian' : 'Student'}
					</span>
					<button className="navbar-logout" type="button" onClick={handleLogout}>
						Logout
					</button>
				</div>
			</div>
		</nav>
	)
}
