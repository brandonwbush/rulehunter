import { NextRequest, NextResponse } from 'next/server';
import { getSession, updateSession } from '@/app/api/game/session';
import type { ApiError, HintResponse } from './types';

interface HintRequest {
  sessionId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as HintRequest;
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' } as ApiError,
        { status: 400 }
      );
    }

    const session = await getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' } as ApiError,
        { status: 404 }
      );
    }

    // Check if hint already used
    if (session.hintUsed) {
      return NextResponse.json(
        { error: 'Hint already used for this game' } as ApiError,
        { status: 400 }
      );
    }

    // Check if game is still in playing or failed phase
    if (session.phase !== 'playing' && session.phase !== 'failed') {
      return NextResponse.json(
        { error: 'Hints can only be requested during gameplay' } as ApiError,
        { status: 400 }
      );
    }

    // Update session to mark hint as used
    await updateSession(sessionId, {
      hintUsed: true
    });

    const response: HintResponse = {
      hint: session.mysteryRule.hint,
      hintUsed: true
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Hint request error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process hint request',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as ApiError,
      { status: 500 }
    );
  }
}
