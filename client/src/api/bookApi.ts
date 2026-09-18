import api from './axios'
import type { ApiResponse, MessageResponse } from '../types/common'
import type { Book, CreateBookRequest } from '../types/book'
import type { Category, CreateCategoryRequest } from '../types/category'

// Fetch all categories from the API
export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<ApiResponse<Category[]>>('/categories')
  return data.data
}

// Create a new category by sending a POST request to the API
export const createCategory = async (
  category: CreateCategoryRequest,
): Promise<MessageResponse> => {
  const { data } = await api.post<MessageResponse>('/categories', category)
  return data
}

// Fetch all books for a specific category from the API
export const getBooks = async (categoryId: number): Promise<Book[]> => {
  const { data } = await api.get<ApiResponse<Book[]>>('/books', {
    params: { categoryId },
  })
  return data.data
}

// Create a new book by sending a POST request to the API
export const createBook = async (book: CreateBookRequest): Promise<MessageResponse> => {
  const { data } = await api.post<MessageResponse>('/books', book)
  return data
}