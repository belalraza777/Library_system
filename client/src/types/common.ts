export interface ApiResponse<T> {
  success: boolean
  data: T
}

export interface MessageResponse {
  message: string
  success: boolean
}
