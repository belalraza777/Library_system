import axios from 'axios'
import { useEffect, useState } from 'react'
import { getRequests, updateRequest } from '../../api/libraryRecordApi'
import type { LibraryRecord } from '../../types/libraryRecord'

export default function RequestsLibrarianPage() {

  const [requests, setRequests] = useState<LibraryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load all book requests when the component mounts
  useEffect(() => {
    void loadRequests()
  }, []);

  async function loadRequests() {
    try {
      setRequests(await getRequests())
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ?? 'Failed to load requests.'
        : 'Failed to load requests.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  // Handle decision (accept/reject) for a book request
  async function handleDecision(id: number, status: 'ACCEPTED' | 'REJECTED') {
    let reason = ''

    if (status === 'REJECTED') {
      reason = window.prompt('Enter rejection reason:')?.trim() ?? ''

      if (!reason) {
        setError('Rejection reason is required.')
        return
      }
    }

    try {
      setError('')
      await updateRequest(id, { status, reason: reason || undefined })
      await loadRequests()
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ?? 'Failed to update request.'
        : 'Failed to update request.'
      setError(message)
    }
  }

  // Format date to a more readable format
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })


  return (
    <main className="container">
      <h1>Book Requests</h1>
      {/*} Display error message if any */}
      {error && <p className="error" role="alert">{error}</p>}

      {/* Display loading message, no requests message, or the requests table */}
      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p>No requests found.</p>
      ) :
        (
          // {/* Display the requests in a table */} 
          <table>
            <thead>
              <tr>
                <th>Student</th>
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
                  <td>{request.student_name ?? 'Some Error'}</td>
                  <td>{request.book_name ?? 'Some Error'}</td>
                  <td>{formatDate(request.from_date)}</td>
                  <td>{formatDate(request.to_date)}</td>
                  <td>{request.status}</td>
                  <td>
                    {request.status === 'PENDING' ? (
                      <>
                        <button type="button" onClick={() => void handleDecision(request.id, 'ACCEPTED')}>
                          Accept
                        </button>
                        <button type="button" onClick={() => void handleDecision(request.id, 'REJECTED')}>
                          Reject
                        </button>
                      </>
                    ) : (
                      request.reason ?? '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </main>
  )
}
