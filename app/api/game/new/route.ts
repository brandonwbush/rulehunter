import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { getRandomRule } from '@/core/game/rule-bank';
import { createSession } from '@/core/game/session-store';
import { NewGameRequest, NewGameResponse, GameSession } from '@/lib/types';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Rate limiting: 10 new games per hour per IP (skip in test environment)
  if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimit = checkRateLimit(`new-game:${ip}`, {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 10,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many game requests. Please try again later.' },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime),
        }
      );
    }
  }

  try {
    const body: NewGameRequest = await request.json();
    const { difficulty, playerName } = body;

    // Get a random rule based on difficulty
    const mysteryRule = getRandomRule(difficulty);

    // Generate session ID
    const sessionId = randomBytes(16).toString('hex');

    // Determine free checks based on difficulty
    const freeChecksMap = { easy: 1, medium: 2, hard: 3 };
    const freeChecks = freeChecksMap[mysteryRule.difficulty];

    // Select example arrays based on difficulty
    const numExamples = freeChecks;
    const exampleArrays = mysteryRule.exampleArrays.slice(0, numExamples);

    // Create game session
    const session: GameSession = {
      id: sessionId,
      playerName: playerName || 'Anonymous',
      difficulty: mysteryRule.difficulty,
      mysteryRuleName: mysteryRule.name,
      phase: 'playing',
      checksUsed: 0,
      maxChecks: 20,
      freeChecks,
      submissions: 0,
      startTime: Date.now(),
      score: 1.0,
      exampleArrays,
      checkHistory: [],
      mysteryRule,
      hintUsed: false
    };

    await createSession(session);

    const response: NewGameResponse = {
      sessionId,
      exampleArrays,
      maxChecks: session.maxChecks,
      freeChecks
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating new game:', error);
    return NextResponse.json(
      { error: 'Failed to create new game' },
      { status: 500 }
    );
  }
}
