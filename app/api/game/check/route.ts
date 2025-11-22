import { NextRequest, NextResponse } from 'next/server';
import { getSession, updateSession } from '@/app/api/game/session';
import { CheckRequest, CheckResponse } from './types';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Rate limiting: 100 checks per minute per IP (skip in test environment)
  if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimit = checkRateLimit(`check:${ip}`, {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 100,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime),
        }
      );
    }
  }

  try {
    const body: CheckRequest = await request.json();
    const { sessionId, array } = body;

    // Validate input
    if (!sessionId || !Array.isArray(array)) {
      return NextResponse.json(
        { error: 'Invalid request: sessionId and array are required' },
        { status: 400 }
      );
    }

    // Validate array contains only numbers
    if (!array.every(item => typeof item === 'number')) {
      return NextResponse.json(
        { error: 'Array must contain only numbers' },
        { status: 400 }
      );
    }

    // Get session
    const session = await getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Check if checks exceeded
    if (session.checksUsed >= session.maxChecks) {
      return NextResponse.json(
        { error: 'Maximum checks exceeded' },
        { status: 400 }
      );
    }

    // Check if in phase where checks aren't allowed
    if (session.phase === 'testing' || session.phase === 'won' || session.phase === 'lost') {
      return NextResponse.json(
        { error: 'Cannot check in current phase' },
        { status: 400 }
      );
    }

    // Test array against mystery rule
    const result = session.mysteryRule.fn(array);

    // Update session
    const updatedSession = await updateSession(sessionId, {
      checksUsed: session.checksUsed + 1,
      checkHistory: [
        ...session.checkHistory,
        {
          array,
          result,
          timestamp: Date.now()
        }
      ]
    });

    if (!updatedSession) {
      return NextResponse.json(
        { error: 'Failed to update session' },
        { status: 500 }
      );
    }

    const response: CheckResponse = {
      result,
      checksRemaining: updatedSession.maxChecks - updatedSession.checksUsed
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing check:', error);
    return NextResponse.json(
      { error: 'Failed to process check' },
      { status: 500 }
    );
  }
}
