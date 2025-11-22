import { NextRequest, NextResponse } from 'next/server';
import { getAuthTokenFromRequest } from '@/app/api/auth/token';
import { getUser } from '@/app/api/auth/user';

export async function GET(request: NextRequest) {
  const authToken = getAuthTokenFromRequest(request);

  if (!authToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const user = await getUser(authToken.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      userId: user.id,
      username: user.username,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
