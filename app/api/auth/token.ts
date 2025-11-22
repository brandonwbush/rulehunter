import { createHmac, timingSafeEqual } from 'crypto';

// Types
export interface AuthToken {
  userId: string
  username: string
  issuedAt: number
}

// Token format: base64(userId:username:issuedAt):signature
// Signature: HMAC-SHA256(data, secret)

const SECRET = process.env.AUTH_SECRET || 'dev-secret-change-in-production';
const TOKEN_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function sign(data: string): string {
  return createHmac('sha256', SECRET).update(data).digest('base64url');
}

export function createAuthToken(userId: string, username: string): string {
  const issuedAt = Date.now();
  const payload = `${userId}:${username}:${issuedAt}`;
  const signature = sign(payload);
  return `${Buffer.from(payload).toString('base64url')}.${signature}`;
}

export function verifyAuthToken(token: string): AuthToken | null {
  try {
    const [payloadB64, signature] = token.split('.');
    if (!payloadB64 || !signature) return null;

    const payload = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const expectedSignature = sign(payload);

    // Timing-safe comparison
    const sigBuf = Buffer.from(signature, 'base64url');
    const expectedBuf = Buffer.from(expectedSignature, 'base64url');
    if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }

    const [userId, username, issuedAtStr] = payload.split(':');
    const issuedAt = parseInt(issuedAtStr, 10);

    if (!userId || !username || isNaN(issuedAt)) return null;

    // Check expiry
    if (Date.now() - issuedAt > TOKEN_EXPIRY_MS) {
      return null;
    }

    return { userId, username, issuedAt };
  } catch {
    return null;
  }
}

export function getAuthTokenFromRequest(request: Request): AuthToken | null {
  // Check Authorization header: "Bearer <token>"
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return verifyAuthToken(token);
  }
  return null;
}
