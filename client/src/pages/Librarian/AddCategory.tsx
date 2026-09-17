import axios from 'axios'
import { useEffect, useState } from 'react'
import { createCategory, getCategories } from '../../api/bookApi'
import type { Category } from '../../types/category'

export default function AddCategory() {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

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
      const response = await createCategory({ name })
      setName('')
      setCategories(await getCategories())
      setSuccess(response.message)
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ?? 'Failed to add category. Please try again.'
        : 'Failed to add category. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">

      {/* Form for adding a new category */}
      <form className="form" method="post" onSubmit={handleSubmit}>
        <h1>Add category</h1>
        {error && <p className="error" role="alert">{error}</p>}
        {success && <p className="success" role="status">{success}</p>}
        <label htmlFor="category-name">
          Category name:
          <input
            id="category-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add category'}
        </button>
      </form>

      {/* Display the list of available categories */}
      <section className="category-list" aria-labelledby="available-categories-heading">
        <h2 id="available-categories-heading">Available categories</h2>
        {categories.length === 0 ? (
          <p>No categories available.</p>
        ) : (
          <ul>
            {categories.map((category) => (
              <li key={category.id}>{category.name}</li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
