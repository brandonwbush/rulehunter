import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/app/api/auth/user';
import { createAuthToken } from '@/app/api/auth/token';
import { RegisterRequest, RegisterResponse } from './types';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Rate limiting: 5 registrations per hour per IP
  if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimit = checkRateLimit(`register:${ip}`, {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 5,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime),
        }
      );
    }
  }

  try {
    const body: RegisterRequest = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const user = await createUser(username, password);
    const token = createAuthToken(user.id, user.username);

    const response: RegisterResponse = {
      userId: user.id,
      username: user.username,
      token,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Registration error:', error);

    // Handle known errors
    if (error instanceof Error) {
      if (error.message === 'Username already exists') {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }
      if (error.message.includes('Username must') || error.message.includes('Password must')) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
