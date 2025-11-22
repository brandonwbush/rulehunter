export interface CheckRequest {
  sessionId: string
  array: number[]
}

export interface CheckResponse {
  result: boolean
  checksRemaining: number
}
