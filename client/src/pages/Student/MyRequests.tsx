import axios from 'axios'
import { useEffect, useState } from 'react'
import { getMyRequests } from '../../api/libraryRecordApi'
import type { LibraryRecord } from '../../types/libraryRecord'

export default function MyRequests() {
  const [requests, setRequests] = useState<LibraryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  const formatDate = (date: string) => new Date(date).toLocaleDateString()

  console.log('Requests:', requests) // Debugging line to check the requests data
  return (
    <main className="container">
      <h1>My requests</h1>
      {error && <p className="error" role="alert">{error}</p>}
      {loading && <p>Loading requests...</p>}
      {!loading && !error && requests.length === 0 && <p>You have not requested any books yet.</p>}
      {!loading && !error && requests.length > 0 && (
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
