export interface SubmitRequest {
  sessionId: string
  code: string
}

export interface SubmitResponse {
  success: boolean
  failedCase?: number[]
  expectedResult?: boolean
  playerResult?: boolean
  testsRun: number
  score?: number
  message: string
}
