export interface LoginResponse {
  success: boolean
  message: string
  user: AuthUser
}

export interface AuthUser {
  id: number | string
  email?: string
  role: 'librarian' | 'student'
  name?: string
}

export interface LibrarianLoginRequest {
  id: number | string
  password: string
}

export interface StudentLoginRequest {
  email: string
  password: string
}

export interface StudentRegistrationRequest {
  name: string
  email: string
  phone?: string
  password: string
}
