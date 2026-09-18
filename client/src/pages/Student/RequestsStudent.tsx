import axios from 'axios'
import { useEffect, useState } from 'react'
import { getMyRequests } from '../../api/libraryRecordApi'
import type { LibraryRecord } from '../../types/libraryRecord'

export default function RequestsStudentPage() {
  const [requests, setRequests] = useState<LibraryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load the user's book requests when the component mounts
  useEffect(() => {
    const loadRequests = async () => {
      try {
        setRequests(await getMyRequests())
      } catch (error) {
        const message = axios.isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message ?? 'Failed to load your requests.'
          : 'Failed to load your requests.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    void loadRequests()
  }, [])

  // Format date to a more readable format
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })


  return (
    <main className="container">
      <h1>My requests</h1>
      {/* Display error message if any */}
      {error && <p className="error" role="alert">{error}</p>}
      {loading && <p>Loading requests...</p>}
      {!loading && !error && requests.length === 0 && <p>You have not requested any books yet.</p>}
      {!loading && !error && requests.length > 0 && (
        // {/* Display the user's requests in a table */}
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>{request.book_name ?? 'Unknown book'}</td>
                <td>{formatDate(request.from_date)}</td>
                <td>{formatDate(request.to_date)}</td>
                <td>{request.status}</td>
                <td>{request.reason ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
