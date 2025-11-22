export type GamePhase = 'preferences' | 'loading' | 'playing' | 'testing' | 'won' | 'failed' | 'lost'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface GameSession {
  id: string
  playerName?: string
  difficulty: Difficulty
  mysteryRuleName: string
  phase: GamePhase
  checksUsed: number
  maxChecks: number
  freeChecks: number
  submissions: number
  startTime: number
  score: number
  exampleArrays: number[][]
  checkHistory: CheckResult[]
  mysteryRule: MysteryRule
  hintUsed: boolean
}

export interface CheckResult {
  array: number[]
  result: boolean
  timestamp: number
}

export interface MysteryRule {
  name: string
  difficulty: Difficulty
  description: string  // Hidden from player
  fn: (arr: number[]) => boolean
  exampleArrays: number[][]
  hint: string  // 0.1 score cost, max 1 per game
}

export interface FailedCase {
  array: number[]
  expectedResult: boolean
  playerResult: boolean
}

// API Request/Response types
export interface NewGameRequest {
  difficulty?: Difficulty
  playerName?: string
}

export interface NewGameResponse {
  sessionId: string
  exampleArrays: number[][]
  maxChecks: number
  freeChecks: number
}

export interface CheckRequest {
  sessionId: string
  array: number[]
}

export interface CheckResponse {
  result: boolean
  checksRemaining: number
}

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

// Standardized API Error Response
export interface ApiError {
  error: string
  code?: string
  details?: unknown
}
