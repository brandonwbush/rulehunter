import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { POST as newGamePost } from '@/app/api/game/new/route';
import { POST as checkPost } from '@/app/api/game/check/route';
import { POST as submitPost } from '@/app/api/game/submit/route';
import { POST as hintPost } from '@/app/api/game/hint/route';
import { NextRequest } from 'next/server';

// Helper to create NextRequest
function createRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost:3000/api/test', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

describe('Game API Endpoints', () => {
  describe('POST /api/game/new', () => {
    it('should create a new game session', async () => {
      const request = createRequest({ playerName: 'Test Player', difficulty: 'medium' });
      const response = await newGamePost(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('sessionId');
      expect(data).toHaveProperty('exampleArrays');
      expect(data).toHaveProperty('maxChecks');
      expect(data).toHaveProperty('freeChecks');
      expect(data.maxChecks).toBe(20);
      expect(data.freeChecks).toBe(2); // medium difficulty
      expect(Array.isArray(data.exampleArrays)).toBe(true);
    });

    it('should create game with easy difficulty', async () => {
      const request = createRequest({ playerName: 'Test Player', difficulty: 'easy' });
      const response = await newGamePost(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.freeChecks).toBe(1);
    });

    it('should create game with hard difficulty', async () => {
      const request = createRequest({ playerName: 'Test Player', difficulty: 'hard' });
      const response = await newGamePost(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.freeChecks).toBe(3);
    });

    it('should create game without player name', async () => {
      const request = createRequest({ difficulty: 'medium' });
      const response = await newGamePost(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('sessionId');
    });
  });

  describe('POST /api/game/check', () => {
    let sessionId: string;

    beforeEach(async () => {
      const request = createRequest({ playerName: 'Test Player', difficulty: 'easy' });
      const response = await newGamePost(request);
      const data = await response.json();
      sessionId = data.sessionId;
    });

    it('should check an array against the rule', async () => {
      const request = createRequest({ sessionId, array: [1, 2, 3] });
      const response = await checkPost(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('result');
      expect(data).toHaveProperty('checksRemaining');
      expect(typeof data.result).toBe('boolean');
      expect(data.checksRemaining).toBe(19);
    });

    it('should reject check without sessionId', async () => {
      const request = createRequest({ array: [1, 2, 3] });
      const response = await checkPost(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should reject check with invalid array', async () => {
      const request = createRequest({ sessionId, array: 'not an array' });
      const response = await checkPost(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should reject check with non-numeric array', async () => {
      const request = createRequest({ sessionId, array: [1, 'two', 3] });
      const response = await checkPost(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('only numbers');
    });

    it('should reject check with invalid sessionId', async () => {
      const request = createRequest({ sessionId: 'invalid-session-id', array: [1, 2, 3] });
      const response = await checkPost(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toContain('not found');
    });

    it('should track multiple checks', async () => {
      // First check
      const request1 = createRequest({ sessionId, array: [1, 2, 3] });
      const response1 = await checkPost(request1);
      const data1 = await response1.json();
      expect(data1.checksRemaining).toBe(19);

      // Second check
      const request2 = createRequest({ sessionId, array: [4, 5, 6] });
      const response2 = await checkPost(request2);
      const data2 = await response2.json();
      expect(data2.checksRemaining).toBe(18);
    });
  });

  describe('POST /api/game/hint', () => {
    let sessionId: string;

    beforeEach(async () => {
      const request = createRequest({ playerName: 'Test Player', difficulty: 'medium' });
      const response = await newGamePost(request);
      const data = await response.json();
      sessionId = data.sessionId;
    });

    it('should return a hint', async () => {
      const request = createRequest({ sessionId });
      const response = await hintPost(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('hint');
      expect(data).toHaveProperty('score');
      expect(typeof data.hint).toBe('string');
      expect(data.hint.length).toBeGreaterThan(0);
      expect(data.score).toBe(0.9); // 1.0 - 0.1 for hint
    });

    it('should reject hint without sessionId', async () => {
      const request = createRequest({});
      const response = await hintPost(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should reject hint with invalid sessionId', async () => {
      const request = createRequest({ sessionId: 'invalid-session-id' });
      const response = await hintPost(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toContain('not found');
    });

    it('should only allow one hint per game', async () => {
      // First hint request
      const request1 = createRequest({ sessionId });
      const response1 = await hintPost(request1);
      expect(response1.status).toBe(200);

      // Second hint request should fail
      const request2 = createRequest({ sessionId });
      const response2 = await hintPost(request2);
      const data2 = await response2.json();

      expect(response2.status).toBe(400);
      expect(data2.error).toContain('already used');
    });

    it('should deduct hint score from total', async () => {
      // Use some checks first to have a score < 1.0
      const checkRequest1 = createRequest({ sessionId, array: [1, 2, 3] });
      await checkPost(checkRequest1);
      const checkRequest2 = createRequest({ sessionId, array: [1, 2, 3] });
      await checkPost(checkRequest2);
      const checkRequest3 = createRequest({ sessionId, array: [1, 2, 3] });
      await checkPost(checkRequest3); // 3 checks, 1 extra check beyond 2 free = -0.05

      // Now request hint
      const hintRequest = createRequest({ sessionId });
      const response = await hintPost(hintRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      // Score should be 1.0 - 0.05 (1 extra check) - 0.1 (hint) = 0.85
      expect(data.score).toBeCloseTo(0.85, 10);
    });
  });

  describe('POST /api/game/submit', () => {
    let sessionId: string;

    beforeEach(async () => {
      const request = createRequest({ playerName: 'Test Player', difficulty: 'easy' });
      const response = await newGamePost(request);
      const data = await response.json();
      sessionId = data.sessionId;
    });

    it('should accept valid function submission', async () => {
      // We don't know the rule, so we'll submit something that might fail
      // but we're testing that the submission mechanism works
      const code = 'function test(arr) { return arr.length > 0; }';
      const request = createRequest({ sessionId, code });
      const response = await submitPost(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('message');
      expect(data).toHaveProperty('testsRun');
      expect(typeof data.success).toBe('boolean');
    });

    it('should reject submission without sessionId', async () => {
      const code = 'function test(arr) { return true; }';
      const request = createRequest({ code });
      const response = await submitPost(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should reject submission without code', async () => {
      const request = createRequest({ sessionId });
      const response = await submitPost(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });

    it('should reject submission with invalid sessionId', async () => {
      const code = 'function test(arr) { return true; }';
      const request = createRequest({ sessionId: 'invalid-session-id', code });
      const response = await submitPost(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toContain('not found');
    });

    it('should reject submission with syntax errors', async () => {
      const code = 'function test(arr) { return arr.length '; // missing closing brace
      const request = createRequest({ sessionId, code });
      const response = await submitPost(request);
      const data = await response.json();

      expect(response.status).toBe(200); // Submission endpoint returns 200 but success: false
      expect(data.success).toBe(false);
      expect(data.message).toBeDefined();
    });
  });
});
