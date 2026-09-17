import api from './axios'
import type { ApiResponse, MessageResponse } from '../types/common'
import type {
  CreateLibraryRecordRequest,
  LibraryRecord,
  UpdateLibraryRecordRequest,
} from '../types/libraryRecord'

// Create a new book request by sending a POST request to the API
export const createBookRequest = async (
  request: CreateLibraryRecordRequest,
): Promise<MessageResponse> => {
  const { data } = await api.post<MessageResponse>('/library-records', request)
  return data
}

// Fetch all book requests made by the logged-in student from the API
export const getMyRequests = async (): Promise<LibraryRecord[]> => {
  const { data } = await api.get<ApiResponse<LibraryRecord[]>>('/library-records/my-requests')
  return data.data
}


// Fetch all book requests from the API (for librarian)
export const getRequests = async (): Promise<LibraryRecord[]> => {
  const { data } = await api.get<ApiResponse<LibraryRecord[]>>('/library-records')
  return data.data
}

// Update the status of a book request by sending a PATCH request to the API
export const updateRequest = async (
  id: number,
  request: UpdateLibraryRecordRequest,
): Promise<MessageResponse> => {
  const { data } = await api.patch<MessageResponse>(`/library-records/${id}`, request)
  return data
}