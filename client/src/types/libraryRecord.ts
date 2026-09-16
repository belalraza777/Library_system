export type LibraryRecordStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'RETURNED'

export interface LibraryRecord {
  id: number
  student_id: number
  book_id: number
  from_date: string
  to_date: string
  status: LibraryRecordStatus
  reason: string | null
  created_at: string
  book_name?: string
  student_name?: string
}

export interface CreateLibraryRecordRequest {
  book_id: number
  from_date: string
  to_date: string
}

export interface UpdateLibraryRecordRequest {
  status: 'ACCEPTED' | 'REJECTED'
  reason?: string
}
