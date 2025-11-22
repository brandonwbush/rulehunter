import { promises as fs } from 'fs';
import { join } from 'path';
import { MysteryRule, Difficulty, getRuleByName } from './rule';

// Types
export type GamePhase = 'preferences' | 'loading' | 'playing' | 'testing' | 'won' | 'failed' | 'lost'

export interface CheckResult {
  array: number[]
  result: boolean
  timestamp: number
}

export interface FailedCase {
  array: number[]
  expectedResult: boolean
  playerResult: boolean
}

export interface GameSession {
  id: string
  username: string
  userId?: string
  difficulty: Difficulty
  mysteryRuleName: string
  phase: GamePhase
  checksUsed: number
  maxChecks: number
  freeChecks: number
  submissions: number
  startTime: number
  score: number
  exampleArrays: number[][]
  checkHistory: CheckResult[]
  mysteryRule: MysteryRule
  hintUsed: boolean
  completedAt?: number
}

export interface GameSessionSummary {
  id: string
  difficulty: Difficulty
  mysteryRuleName: string
  phase: GamePhase
  score: number
  startTime: number
  completedAt?: number
}

interface StoredSession extends Omit<GameSession, 'mysteryRule'> {
  mysteryRuleName: string;
  createdAt: number;
}

const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
const localDir = join(process.cwd(), '.sessions');

// Session TTL: 7 days
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// Clean up old sessions every hour
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    cleanupExpiredSessions().catch((err) => {
      console.error('Failed to cleanup sessions:', err);
    });
  }, 60 * 60 * 1000); // 1 hour
}

async function ensureLocalDir() {
  try {
    await fs.mkdir(localDir, { recursive: true });
  } catch {}
}

async function localWrite(id: string, data: string): Promise<void> {
  await ensureLocalDir();
  await fs.writeFile(join(localDir, `${id}.json`), data, 'utf-8');
}

async function localRead(id: string): Promise<string | undefined> {
  try {
    return await fs.readFile(join(localDir, `${id}.json`), 'utf-8');
  } catch {
    return undefined;
  }
}

async function blobWrite(id: string, data: string): Promise<void> {
  const { put } = await import('@vercel/blob');
  await put(`sessions/${id}.json`, data, {
    access: 'public',
    addRandomSuffix: false,
    cacheControlMaxAge: 0 // Disable caching
  });
}

async function blobRead(id: string): Promise<string | undefined> {
  try {
    const { head } = await import('@vercel/blob');
    const blob = await head(`sessions/${id}.json`);
    const response = await fetch(blob.url, {
      cache: 'no-store', // Bypass cache
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
    return await response.text();
  } catch {
    return undefined;
  }
}

export async function createSession(session: GameSession, isUpdate = false): Promise<void> {
  const { mysteryRule, ...rest } = session;

  const stored: StoredSession = {
    ...rest,
    mysteryRuleName: mysteryRule.name,
    createdAt: rest.startTime,
  };
  const data = JSON.stringify(stored);

  if (useBlob) {
    await blobWrite(session.id, data);
  } else {
    await localWrite(session.id, data);
  }
}

export async function getSession(id: string): Promise<GameSession | undefined> {
  const data = useBlob ? await blobRead(id) : await localRead(id);
  if (!data) return undefined;

  const stored: StoredSession = JSON.parse(data);

  // Check if session has expired
  if (stored.createdAt + SESSION_TTL_MS < Date.now()) {
    // Session expired, delete it
    await deleteSession(id);
    return undefined;
  }

  const rule = getRuleByName(stored.mysteryRuleName);
  if (!rule) return undefined;

  return { ...stored, mysteryRule: rule };
}

export async function updateSession(
  id: string,
  updates: Partial<GameSession & { mysteryRuleName?: string }>
): Promise<GameSession | undefined> {
  // Read current session data directly without triggering getSession
  const data = useBlob ? await blobRead(id) : await localRead(id);
  if (!data) return undefined;

  const stored: StoredSession = JSON.parse(data);

  // Apply updates to stored data
  const updatedStored: StoredSession = { ...stored, ...updates as any };

  // Write back
  const newData = JSON.stringify(updatedStored);
  if (useBlob) {
    await blobWrite(id, newData);
  } else {
    await localWrite(id, newData);
  }

  // Return full session with mystery rule
  const rule = getRuleByName(updatedStored.mysteryRuleName);
  if (!rule) return undefined;

  return { ...updatedStored, mysteryRule: rule };
}

async function deleteSession(id: string): Promise<void> {
  try {
    if (!useBlob) {
      await fs.unlink(join(localDir, `${id}.json`));
    }
    // Note: Blob storage doesn't easily support deletion
  } catch {
    // Ignore errors (file might not exist)
  }
}

async function cleanupExpiredSessions(): Promise<void> {
  if (useBlob) {
    // Skip cleanup for blob storage (would need list operation)
    return;
  }

  try {
    await ensureLocalDir();
    const files = await fs.readdir(localDir);
    const now = Date.now();

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      try {
        const data = await fs.readFile(join(localDir, file), 'utf-8');
        const stored: StoredSession = JSON.parse(data);

        if (stored.createdAt + SESSION_TTL_MS < now) {
          await fs.unlink(join(localDir, file));
          console.log(`Cleaned up expired session: ${file}`);
        }
      } catch {
        // Skip invalid files
      }
    }
  } catch (err) {
    console.error('Failed to cleanup sessions:', err);
  }
}
