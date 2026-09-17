import { NavLink } from 'react-router-dom'

const librarianFeatures = [
  { label: 'Register student', path: '/librarian/register-student' },
  { label: 'Manage categories', path: '/librarian/categories' },
  { label: 'Manage books', path: '/librarian/books' },
  { label: 'View requests', path: '/librarian/requests' },
]

export default function Dashboard() {
  return (
    <main className="container librarian-dashboard">
      <h1>Librarian dashboard</h1>
      <nav className="librarian-navigation" aria-label="Librarian features">
        {librarianFeatures.map((feature) => (
          <NavLink key={feature.path} to={feature.path} className="librarian-navigation-link">
            {feature.label}
          </NavLink>
        ))}
      </nav>
    </main>
  )
}
