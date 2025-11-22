import { Difficulty } from '@/app/api/game/rule';

export interface NewGameRequest {
  difficulty?: Difficulty
  username?: string
  isDaily?: boolean
}

export interface NewGameResponse {
  sessionId: string
  exampleArrays: number[][]
  maxChecks: number
  freeChecks: number
}
