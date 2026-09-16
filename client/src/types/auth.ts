export interface LoginResponse {
  message: string
  user: AuthUser
}

export interface AuthUser {
  id: number | string
  email?: string
  role: 'librarian' | 'student'
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
