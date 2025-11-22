import { GameSession } from '@/lib/types';

const CHECK_PENALTY = 0.05;
const SUBMISSION_PENALTY = 0.2;
const HINT_PENALTY = 0.1;

export function calculateScore(session: GameSession): number {
  let score = 1.0;

  // Deduct for checks after the free ones
  const extraChecks = Math.max(0, session.checksUsed - session.freeChecks);
  score -= extraChecks * CHECK_PENALTY;

  // Deduct for submissions after the first one
  const extraSubmissions = Math.max(0, session.submissions - 1);
  score -= extraSubmissions * SUBMISSION_PENALTY;

  // Deduct for hint if used
  if (session.hintUsed) {
    score -= HINT_PENALTY;
  }

  // Ensure minimum score is 0
  return Math.max(0, score);
}
