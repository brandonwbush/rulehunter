import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword } from '@/app/api/auth/user';
import { createAuthToken } from '@/app/api/auth/token';
import { LoginRequest, LoginResponse } from './types';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Rate limiting: 10 login attempts per 15 minutes per IP
  if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimit = checkRateLimit(`login:${ip}`, {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 10,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime),
        }
      );
    }
  }

  try {
    const body: LoginRequest = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const user = await verifyPassword(username, password);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const token = createAuthToken(user.id, user.username);

    const response: LoginResponse = {
      userId: user.id,
      username: user.username,
      token,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
