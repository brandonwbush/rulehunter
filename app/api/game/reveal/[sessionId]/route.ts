import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/core/game/session-store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const session = await getSession(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      description: session.mysteryRule.description
    });
  } catch (error) {
    console.error('Error revealing rule:', error);
    return NextResponse.json(
      { error: 'Failed to reveal rule' },
      { status: 500 }
    );
  }
}
