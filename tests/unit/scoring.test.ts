import { describe, it, expect } from 'vitest';
import { calculateScore } from '@/app/api/game/scoring';
import { GameSession } from '@/app/api/game/session';

function createMockSession(overrides: Partial<GameSession> = {}): GameSession {
  return {
    id: 'test-session',
    playerName: 'Test Player',
    difficulty: 'medium',
    mysteryRuleName: 'test-rule',
    phase: 'playing',
    checksUsed: 0,
    maxChecks: 20,
    freeChecks: 2,
    submissions: 0,
    startTime: Date.now(),
    score: 0,
    exampleArrays: [],
    checkHistory: [],
    mysteryRule: {
      name: 'test-rule',
      difficulty: 'medium',
      description: 'Test rule',
      fn: () => true,
      exampleArrays: [],
      hint: 'Test hint',
    },
    hintUsed: false,
    ...overrides,
  };
}

describe('calculateScore', () => {
  it('should return 1.0 for perfect game (no checks, first submission)', () => {
    const session = createMockSession({
      checksUsed: 0,
      freeChecks: 2,
      submissions: 1,
    });
    expect(calculateScore(session)).toBe(1.0);
  });

  it('should return 1.0 for free checks only', () => {
    const session = createMockSession({
      checksUsed: 2,
      freeChecks: 2,
      submissions: 1,
    });
    expect(calculateScore(session)).toBe(1.0);
  });

  it('should deduct 0.05 per extra check', () => {
    const session = createMockSession({
      checksUsed: 3, // 1 extra check beyond 2 free
      freeChecks: 2,
      submissions: 1,
    });
    expect(calculateScore(session)).toBe(0.95);
  });

  it('should deduct 0.2 per extra submission', () => {
    const session = createMockSession({
      checksUsed: 2,
      freeChecks: 2,
      submissions: 2, // 1 extra submission
    });
    expect(calculateScore(session)).toBe(0.8);
  });

  it('should deduct for both checks and submissions', () => {
    const session = createMockSession({
      checksUsed: 5, // 3 extra checks = -0.15
      freeChecks: 2,
      submissions: 2, // 1 extra submission = -0.2
    });
    // 1.0 - 0.15 - 0.2 = 0.65
    expect(calculateScore(session)).toBeCloseTo(0.65, 10);
  });

  it('should deduct 0.1 for hint usage', () => {
    const session = createMockSession({
      checksUsed: 0,
      freeChecks: 2,
      submissions: 1,
      hintUsed: true,
    });
    expect(calculateScore(session)).toBe(0.9);
  });

  it('should deduct for checks, submissions, and hint', () => {
    const session = createMockSession({
      checksUsed: 3, // 1 extra check = -0.05
      freeChecks: 2,
      submissions: 2, // 1 extra submission = -0.2
      hintUsed: true, // hint = -0.1
    });
    // 1.0 - 0.05 - 0.2 - 0.1 = 0.65
    expect(calculateScore(session)).toBeCloseTo(0.65, 10);
  });

  it('should never go below 0', () => {
    const session = createMockSession({
      checksUsed: 20,
      freeChecks: 2,
      submissions: 5,
    });
    const score = calculateScore(session);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBe(0);
  });

  it('should handle easy difficulty with more free checks', () => {
    const session = createMockSession({
      difficulty: 'easy',
      checksUsed: 1,
      freeChecks: 1,
      submissions: 1,
    });
    expect(calculateScore(session)).toBe(1.0);
  });

  it('should handle hard difficulty with more free checks', () => {
    const session = createMockSession({
      difficulty: 'hard',
      checksUsed: 3,
      freeChecks: 3,
      submissions: 1,
    });
    expect(calculateScore(session)).toBe(1.0);
  });

  it('should calculate correctly at score boundary', () => {
    const session = createMockSession({
      checksUsed: 22, // 20 extra checks = -1.0
      freeChecks: 2,
      submissions: 1,
    });
    expect(calculateScore(session)).toBe(0);
  });
});
