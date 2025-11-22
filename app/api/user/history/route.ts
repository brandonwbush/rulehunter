import { NextRequest, NextResponse } from 'next/server';
import { getAuthTokenFromRequest } from '@/app/api/auth/token';
import { UserHistoryResponse } from './types';
import { GameSessionSummary } from '@/app/api/game/session';

const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

async function getAllUserSessions(userId: string): Promise<GameSessionSummary[]> {
  if (useBlob) {
    return getBlobUserSessions(userId);
  } else {
    return getLocalUserSessions(userId);
  }
}

async function getLocalUserSessions(userId: string): Promise<GameSessionSummary[]> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const sessionsDir = path.join(process.cwd(), '.sessions');

  try {
    const files = await fs.readdir(sessionsDir);
    const sessions: GameSessionSummary[] = [];

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      try {
        const data = await fs.readFile(path.join(sessionsDir, file), 'utf-8');
        const session = JSON.parse(data);

        if (session.userId === userId) {
          sessions.push({
            id: session.id,
            difficulty: session.difficulty,
            mysteryRuleName: session.mysteryRuleName,
            phase: session.phase,
            score: session.score,
            startTime: session.startTime,
            completedAt: session.completedAt,
          });
        }
      } catch {
        // Skip invalid files
      }
    }

    return sessions;
  } catch {
    return [];
  }
}

async function getBlobUserSessions(userId: string): Promise<GameSessionSummary[]> {
  try {
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: 'sessions/' });
    const sessions: GameSessionSummary[] = [];

    // Fetch each blob and filter by userId
    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        });
        const data = await response.text();
        const session = JSON.parse(data);

        if (session.userId === userId) {
          sessions.push({
            id: session.id,
            difficulty: session.difficulty,
            mysteryRuleName: session.mysteryRuleName,
            phase: session.phase,
            score: session.score,
            startTime: session.startTime,
            completedAt: session.completedAt,
          });
        }
      } catch {
        // Skip invalid blobs
      }
    }

    return sessions;
  } catch {
    return [];
  }
}

function filterUserHistory(sessions: GameSessionSummary[]): GameSessionSummary[] {
  // Sort by start time (newest first)
  const sorted = sessions.sort((a, b) => b.startTime - a.startTime);

  // Separate completed and non-completed
  const completed = sorted.filter(s => s.completedAt !== undefined);
  const nonCompleted = sorted.filter(s => s.completedAt === undefined);

  // Return all completed + last non-completed
  const result = [...completed];
  if (nonCompleted.length > 0) {
    result.push(nonCompleted[0]);
  }

  return result;
}

export async function GET(request: NextRequest) {
  const authToken = getAuthTokenFromRequest(request);

  if (!authToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const allSessions = await getAllUserSessions(authToken.userId);
    const filteredSessions = filterUserHistory(allSessions);

    const response: UserHistoryResponse = {
      sessions: filteredSessions,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching user history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user history' },
      { status: 500 }
    );
  }
}
