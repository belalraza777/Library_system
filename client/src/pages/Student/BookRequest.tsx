import axios from 'axios'
import { useState, useEffect } from 'react'
import type { Category } from '../../types/category'
import type { Book } from '../../types/book'
import type { CreateLibraryRecordRequest } from '../../types/libraryRecord'
import { getCategories, getBooks } from '../../api/bookApi'
import { createBookRequest } from '../../api/libraryRecordApi'


export default function BookRequest() {

  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [books, setBooks] = useState<Book[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<CreateLibraryRecordRequest>({
    book_id: 0,
    from_date: '',
    to_date: '',
  });

  // Load categories when the component mounts
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategories(await getCategories())
      } catch (error) {
        setLoading(false)
        const message = axios.isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message ?? 'Failed to load categories.'
          : 'Failed to load categories.'
        setError(message)
      }
    }
    loadCategories()
  }, []);

  //Fetch books based on selected category
  useEffect(() => {
    const loadBooks = async () => {
      if (selectedCategoryId) {
        try {
          const response = await getBooks(Number(selectedCategoryId))
          setBooks(response)
        } catch (error) {
          const message = axios.isAxiosError<{ message?: string }>(error)
            ? error.response?.data?.message ?? 'Failed to load books.'
            : 'Failed to load books.'
          setError(message)
        }
      }
    }
    loadBooks()
  }, [selectedCategoryId])



  // Handle input changes
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  // Handle form submission
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (!formData.book_id || !formData.from_date || !formData.to_date) {
        setError('Please fill in all required fields.');
        return
      }

      const response = await createBookRequest(formData)
      setSuccess(response.message)
      setFormData({ book_id: 0, from_date: '', to_date: '' })
      setSelectedCategoryId('')
      setBooks([])

    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ?? 'Failed to submit book request. Please try again.'
        : 'Failed to submit book request. Please try again.'
      setError(message)
    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="container">
      <form className="form" method="post" onSubmit={handleSubmit}>
        <h1>Request a book</h1>
        {error && <p className="error" role="alert">{error}</p>}
        {success && <p className="success" role="status">{success}</p>}

        {/* Category selection dropdown */}
        <label htmlFor="book-category">
          Category:
          <select
            id="book-category"
            value={selectedCategoryId}
            onChange={(event) => setSelectedCategoryId(event.target.value)}
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
        {/* Book selection dropdown */}
        <label htmlFor="book-name">
          Book:
          <select
            id="book-name"
            name="book_id"
            value={formData.book_id || ''}
            onChange={(event) => setFormData((prevData) => ({ ...prevData, book_id: Number(event.target.value) }))}
            required
          >
            <option value="">Select a book</option>
            {books.map((book) => (
              <option
                key={book.id}
                value={book.id}
                className={!book.available ? 'book-option-unavailable' : undefined}
                disabled={!book.available}
              >
                {book.book_name} {book.available ? '' : '(Not Available)'}
              </option>
            ))}
          </select>
        </label>
        {/* From date input field */}
        <label htmlFor="from-date">
          From:
          <input
            type="date"
            id="from-date"
            name="from_date"
            value={formData.from_date}
            onChange={handleChange}
            required
          />
        </label>
        {/* To date input field */}
        <label htmlFor="to-date">
          To:
          <input
            type="date"
            id="to-date"
            name="to_date"
            value={formData.to_date}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={loading || !formData.book_id}>
          {loading ? 'Requesting...' : 'Request Book'}
        </button>
  
      </form>
    </main>
  )
}
