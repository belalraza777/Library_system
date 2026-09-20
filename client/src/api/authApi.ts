import api from './axios'
import type {
  LibrarianLoginRequest,
  LoginResponse,
  StudentLoginRequest,
  StudentRegistrationRequest,
} from '../types/auth'
import type { MessageResponse } from '../types/common'

//Login for Librarian 
export const loginLibrarian = async (
  credentials: LibrarianLoginRequest,
): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>('/auth/librarian/login', credentials)
  return data
}

//Login for Student
export const loginStudent = async (
  credentials: StudentLoginRequest,
): Promise<LoginResponse> => {
  const {data } = await api.post<LoginResponse>('/auth/student/login', credentials)
  return data;
}

export const logoutUser = async (): Promise<MessageResponse> => {
  const { data } = await api.post<MessageResponse>('/auth/logout')
  return data
}

//Register a new Student
export const registerStudent = async (
  student: StudentRegistrationRequest,
): Promise<MessageResponse> => {
  const { data } = await api.post<MessageResponse>('/students', student)
  return data
}