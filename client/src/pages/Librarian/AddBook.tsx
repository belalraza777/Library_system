import axios from 'axios'
import { useEffect, useState } from 'react'
import { createBook, getCategories } from '../../api/bookApi'
import type { Category } from '../../types/category'

export default function AddBook() {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState('')
  const [bookName, setBookName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Load categories when the component mounts
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategories(await getCategories())
      } catch (error) {
        const message = axios.isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message ?? 'Failed to load categories.'
          : 'Failed to load categories.'
        setError(message)
      }
    }
    void loadCategories()
  }, [])

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await createBook({
        category_id: Number(categoryId),
        book_name: bookName,
      })
      setBookName('')
      setCategoryId('')
      setSuccess(response.message)
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ?? 'Failed to add book. Please try again.'
        : 'Failed to add book. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <form className="form" method="post" onSubmit={handleSubmit}>
        <h1>Add book</h1>
        {/* Display error or success messages */}
        {error && <p className="error" role="alert">{error}</p>}
        {success && <p className="success" role="status">{success}</p>}
        {/* Category selection dropdown */}
        <label htmlFor="book-category">
          Category:
          <select
            id="book-category"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        {/* Book name input field */}
        <label htmlFor="book-name">
          Book name:
          <input
            id="book-name"
            type="text"
            value={bookName}
            onChange={(event) => setBookName(event.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading || categories.length === 0}>
          {loading ? 'Adding...' : 'Add book'}
        </button>
      </form>
    </main>
  )
}
