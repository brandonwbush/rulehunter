import { promises as fs } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';

// Types
export interface User {
  id: string
  username: string
  passwordHash: string
  createdAt: number
}

const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
const localDir = join(process.cwd(), '.users');

// Username constraints: 3-50 chars, alphanumeric + @._-
const USERNAME_REGEX = /^[a-zA-Z0-9@._-]{3,50}$/;

// Password constraints: 8-128 chars
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

// Bcrypt rounds
const BCRYPT_ROUNDS = 12;

interface UserIndex {
  [username: string]: string; // username -> userId mapping
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

async function blobWrite(path: string, data: string): Promise<void> {
  const { put } = await import('@vercel/blob');
  await put(path, data, {
    access: 'public',
    addRandomSuffix: false,
    cacheControlMaxAge: 0,
  });
}

async function blobRead(path: string): Promise<string | undefined> {
  try {
    const { head } = await import('@vercel/blob');
    const blob = await head(path);
    const response = await fetch(blob.url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
    return await response.text();
  } catch {
    return undefined;
  }
}

async function getUserIndex(): Promise<UserIndex> {
  const path = useBlob ? 'users/_index.json' : '_index';
  const data = useBlob ? await blobRead(path) : await localRead(path);
  if (!data) return {};
  return JSON.parse(data);
}

async function saveUserIndex(index: UserIndex): Promise<void> {
  const data = JSON.stringify(index);
  const path = useBlob ? 'users/_index.json' : '_index';
  if (useBlob) {
    await blobWrite(path, data);
  } else {
    await localWrite(path, data);
  }
}

export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'Username is required' };
  }
  if (!USERNAME_REGEX.test(username)) {
    return {
      valid: false,
      error: 'Username must be 3-50 characters and contain only letters, numbers, @, ., _, or -',
    };
  }
  return { valid: true };
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { valid: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` };
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return { valid: false, error: `Password must be no more than ${MAX_PASSWORD_LENGTH} characters` };
  }
  return { valid: true };
}

export async function createUser(username: string, password: string): Promise<User> {
  // Normalize username (lowercase for uniqueness check)
  const normalizedUsername = username.toLowerCase();

  // Validate
  const usernameValidation = validateUsername(username);
  if (!usernameValidation.valid) {
    throw new Error(usernameValidation.error);
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    throw new Error(passwordValidation.error);
  }

  // Check if username exists
  const index = await getUserIndex();
  if (index[normalizedUsername]) {
    throw new Error('Username already exists');
  }

  // Hash password
  const bcrypt = await import('bcrypt');
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  // Create user
  const userId = randomBytes(16).toString('hex');
  const user: User = {
    id: userId,
    username, // Store original case
    passwordHash,
    createdAt: Date.now(),
  };

  // Save user
  const userData = JSON.stringify(user);
  const path = useBlob ? `users/${userId}.json` : userId;
  if (useBlob) {
    await blobWrite(path, userData);
  } else {
    await localWrite(path, userData);
  }

  // Update index
  index[normalizedUsername] = userId;
  await saveUserIndex(index);

  return user;
}

export async function getUser(userId: string): Promise<User | undefined> {
  const path = useBlob ? `users/${userId}.json` : userId;
  const data = useBlob ? await blobRead(path) : await localRead(path);
  if (!data) return undefined;
  return JSON.parse(data);
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const normalizedUsername = username.toLowerCase();
  const index = await getUserIndex();
  const userId = index[normalizedUsername];
  if (!userId) return undefined;
  return getUser(userId);
}

export async function verifyPassword(username: string, password: string): Promise<User | null> {
  const user = await getUserByUsername(username);
  if (!user) return null;

  const bcrypt = await import('bcrypt');
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  return user;
}
