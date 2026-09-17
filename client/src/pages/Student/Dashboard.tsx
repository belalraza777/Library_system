import { NavLink } from 'react-router-dom'

const studentFeatures = [
  { label: 'Request a book', path: '/student/request-book' },
  { label: 'My requests', path: '/student/requests' },
]

export default function Dashboard() {
  return (
    <main className="container student-dashboard">
      <h1>Student dashboard</h1>
      <nav className="student-navigation" aria-label="Student features">
        {studentFeatures.map((feature) => (
          <NavLink key={feature.path} to={feature.path} className="student-navigation-link">
            {feature.label}
          </NavLink>
        ))}
      </nav>
    </main>
  )
}
