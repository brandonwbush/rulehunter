import { NextRequest, NextResponse } from 'next/server';
import { getSession, updateSession } from '../session';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get the current session
    const session = await getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Check if already completed
    if (session.phase === 'won' || session.phase === 'lost' || session.phase === 'failed') {
      return NextResponse.json(
        { error: 'Game already completed' },
        { status: 400 }
      );
    }

    // Mark as lost with score 0
    const updatedSession = await updateSession(sessionId, {
      phase: 'lost',
      score: 0,
      completedAt: Date.now(),
    });

    if (!updatedSession) {
      return NextResponse.json(
        { error: 'Failed to update session' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      session: {
        id: updatedSession.id,
        phase: updatedSession.phase,
        score: updatedSession.score,
        completedAt: updatedSession.completedAt,
      },
    });
  } catch (error) {
    console.error('Quit error:', error);
    return NextResponse.json(
      { error: 'Failed to quit game' },
      { status: 500 }
    );
  }
}
