export interface RegisterRequest {
  username: string
  password: string
}

export interface RegisterResponse {
  userId: string
  username: string
  token: string
}
