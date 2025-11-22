import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createSession, getSession, updateSession } from '@/core/game/session-store';
import { GameSession } from '@/lib/types';
import { promises as fs } from 'fs';
import { join } from 'path';

const localDir = join(process.cwd(), '.sessions');

// Helper to create a test session
function createTestSession(id: string): GameSession {
  return {
    id,
    playerName: 'Test Player',
    difficulty: 'medium',
    mysteryRuleName: 'all-positive',
    phase: 'playing',
    checksUsed: 0,
    maxChecks: 20,
    freeChecks: 2,
    submissions: 0,
    startTime: Date.now(),
    score: 0,
    exampleArrays: [[1, 2, 3]],
    checkHistory: [],
    mysteryRule: {
      name: 'all-positive',
      difficulty: 'medium',
      description: 'All numbers must be positive',
      fn: (arr) => arr.every(n => n > 0),
      exampleArrays: [[1, 2, 3]],
      hint: 'Check if all numbers are positive',
    },
    hintUsed: false,
  };
}

describe('Session Store', () => {
  const testSessionId = 'test-session-' + Date.now();

  afterEach(async () => {
    // Clean up test session files
    try {
      await fs.unlink(join(localDir, `${testSessionId}.json`));
    } catch {}
  });

  describe('createSession', () => {
    it('should create a new session', async () => {
      const session = createTestSession(testSessionId);
      await createSession(session);

      // Verify session was created by trying to retrieve it
      const retrieved = await getSession(testSessionId);
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(testSessionId);
      expect(retrieved?.playerName).toBe('Test Player');
    });

    it('should store all session properties', async () => {
      const session = createTestSession(testSessionId);
      await createSession(session);

      const retrieved = await getSession(testSessionId);
      expect(retrieved?.difficulty).toBe('medium');
      expect(retrieved?.checksUsed).toBe(0);
      expect(retrieved?.maxChecks).toBe(20);
      expect(retrieved?.freeChecks).toBe(2);
      expect(retrieved?.submissions).toBe(0);
      expect(retrieved?.hintUsed).toBe(false);
    });

    it('should store mystery rule', async () => {
      const session = createTestSession(testSessionId);
      await createSession(session);

      const retrieved = await getSession(testSessionId);
      expect(retrieved?.mysteryRule).toBeDefined();
      expect(retrieved?.mysteryRule.name).toBe('all-positive');
      expect(typeof retrieved?.mysteryRule.fn).toBe('function');
    });
  });

  describe('getSession', () => {
    it('should return undefined for non-existent session', async () => {
      const retrieved = await getSession('non-existent-session-id');
      expect(retrieved).toBeUndefined();
    });

    it('should retrieve an existing session', async () => {
      const session = createTestSession(testSessionId);
      await createSession(session);

      const retrieved = await getSession(testSessionId);
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(testSessionId);
    });

    it('should restore mystery rule function', async () => {
      const session = createTestSession(testSessionId);
      await createSession(session);

      const retrieved = await getSession(testSessionId);
      expect(retrieved?.mysteryRule.fn).toBeDefined();
      expect(typeof retrieved?.mysteryRule.fn).toBe('function');

      // Test that the function works
      const result = retrieved?.mysteryRule.fn([1, 2, 3]);
      expect(result).toBe(true);
    });
  });

  describe('updateSession', () => {
    beforeEach(async () => {
      const session = createTestSession(testSessionId);
      await createSession(session);
    });

    it('should update session properties', async () => {
      const updated = await updateSession(testSessionId, {
        checksUsed: 5,
        submissions: 1,
      });

      expect(updated).toBeDefined();
      expect(updated?.checksUsed).toBe(5);
      expect(updated?.submissions).toBe(1);
    });

    it('should update check history', async () => {
      const updated = await updateSession(testSessionId, {
        checkHistory: [
          { array: [1, 2, 3], result: true, timestamp: Date.now() },
        ],
      });

      expect(updated?.checkHistory).toHaveLength(1);
      expect(updated?.checkHistory[0].array).toEqual([1, 2, 3]);
      expect(updated?.checkHistory[0].result).toBe(true);
    });

    it('should update hint usage', async () => {
      const updated = await updateSession(testSessionId, {
        hintUsed: true,
      });

      expect(updated?.hintUsed).toBe(true);
    });

    it('should return undefined for non-existent session', async () => {
      const updated = await updateSession('non-existent-session-id', {
        checksUsed: 5,
      });

      expect(updated).toBeUndefined();
    });

    it('should preserve existing properties when updating', async () => {
      const updated = await updateSession(testSessionId, {
        checksUsed: 5,
      });

      expect(updated?.playerName).toBe('Test Player');
      expect(updated?.difficulty).toBe('medium');
      expect(updated?.maxChecks).toBe(20);
      expect(updated?.checksUsed).toBe(5);
    });

    it('should allow multiple updates', async () => {
      // First update
      await updateSession(testSessionId, { checksUsed: 1 });

      // Second update
      await updateSession(testSessionId, { checksUsed: 2 });

      // Third update
      const final = await updateSession(testSessionId, { checksUsed: 3 });

      expect(final?.checksUsed).toBe(3);
    });
  });

  describe('session persistence', () => {
    it('should persist session across getSession calls', async () => {
      const session = createTestSession(testSessionId);
      await createSession(session);

      // Get session multiple times
      const first = await getSession(testSessionId);
      const second = await getSession(testSessionId);
      const third = await getSession(testSessionId);

      expect(first?.id).toBe(testSessionId);
      expect(second?.id).toBe(testSessionId);
      expect(third?.id).toBe(testSessionId);
    });

    it('should persist updates across getSession calls', async () => {
      const session = createTestSession(testSessionId);
      await createSession(session);

      await updateSession(testSessionId, { checksUsed: 10 });

      const retrieved = await getSession(testSessionId);
      expect(retrieved?.checksUsed).toBe(10);
    });
  });
});
