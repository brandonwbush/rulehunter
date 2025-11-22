import { GameSessionSummary } from '@/app/api/game/session';

export interface UserHistoryResponse {
  sessions: GameSessionSummary[]
}
