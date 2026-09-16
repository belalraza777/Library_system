export interface Book {
  id: number
  category_id: number
  book_name: string
  available: boolean
}

export interface CreateBookRequest {
  category_id: number
  book_name: string
}
