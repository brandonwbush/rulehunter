import { NextRequest, NextResponse } from 'next/server';
import { getSession, updateSession } from '@/core/game/session-store';
import { executeSandboxed } from '@/core/game/sandbox';
import { generateTestCases } from '@/core/game/fuzzer';
import { SubmitRequest, SubmitResponse } from '@/lib/types';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Rate limiting: 20 submissions per minute per IP
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const rateLimit = checkRateLimit(`submit:${ip}`, {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many submissions. Please slow down.' },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime),
      }
    );
  }

  try {
    const body: SubmitRequest = await request.json();
    const { sessionId, code } = body;

    // Validate input
    if (!sessionId || !code) {
      return NextResponse.json(
        { error: 'Invalid request: sessionId and code are required' },
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

    // Update phase to testing
    await updateSession(sessionId, { phase: 'testing' });

    // Generate test cases
    const testCases = generateTestCases({ numTests: 1000 });

    // Test player's code against mystery rule
    let testsRun = 0;
    let failedCase: number[] | undefined;
    let expectedResult: boolean | undefined;
    let playerResult: boolean | undefined;

    for (const testArray of testCases) {
      testsRun++;

      // Get expected result from mystery rule
      const expected = session.mysteryRule.fn(testArray);

      // Get player's result
      const sandboxResult = await executeSandboxed(code, testArray);

      if (!sandboxResult.success) {
        // Code execution failed
        const response: SubmitResponse = {
          success: false,
          testsRun,
          message: `Code execution error: ${sandboxResult.error}`
        };

        await updateSession(sessionId, {
          phase: 'failed',
          submissions: session.submissions + 1
        });

        return NextResponse.json(response);
      }

      // Compare results
      if (sandboxResult.result !== expected) {
        // Found a failed case!
        failedCase = testArray;
        expectedResult = expected;
        playerResult = sandboxResult.result;
        break;
      }
    }

    if (failedCase) {
      // Failed - found failed case
      const response: SubmitResponse = {
        success: false,
        failedCase,
        expectedResult,
        playerResult,
        testsRun,
        message: 'Failed test case found! Your rule doesn\'t match the mystery rule.'
      };

      await updateSession(sessionId, {
        phase: 'failed',
        submissions: session.submissions + 1
      });

      return NextResponse.json(response);
    }

    // Success! No failures found
    const updatedSession = await updateSession(sessionId, {
      phase: 'won',
      submissions: session.submissions + 1
    });

    if (!updatedSession) {
      return NextResponse.json(
        { error: 'Failed to update session' },
        { status: 500 }
      );
    }

    const response: SubmitResponse = {
      success: true,
      testsRun,
      message: `Congratulations! You discovered the rule: "${session.mysteryRule.description}"`
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing submission:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}
