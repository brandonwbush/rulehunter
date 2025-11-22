export interface HintRequest {
  sessionId: string
}

export interface HintResponse {
  hint: string
  hintUsed: boolean
}

export interface ApiError {
  error: string
  code?: string
  details?: unknown
}
