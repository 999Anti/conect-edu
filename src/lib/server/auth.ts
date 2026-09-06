import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { NextRequest } from 'next/server';
import { StoredUser } from './database';

const secret = process.env.AUTH_SECRET || 'development-only-change-me-before-production';
const tokenLifetimeSeconds = 60 * 60 * 24 * 7;

const encode = (value: string) => Buffer.from(value).toString('base64url');
const decode = (value: string) => Buffer.from(value, 'base64url').toString('utf8');

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64).toString('hex');
  return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(candidate, 'hex'));
}

export function createToken(userId: string): string {
  const payload = encode(JSON.stringify({ sub: userId, exp: Math.floor(Date.now() / 1000) + tokenLifetimeSeconds }));
  const signature = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function getAuthenticatedUser(request: NextRequest, users: StoredUser[]): StoredUser | null {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) return null;
  const [payload, signature] = authorization.slice(7).split('.');
  if (!payload || !signature) return null;
  const expected = createHmac('sha256', secret).update(payload).digest('base64url');
  if (expected.length !== signature.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null;
  try {
    const token = JSON.parse(decode(payload)) as { sub: string; exp: number };
    if (token.exp < Math.floor(Date.now() / 1000)) return null;
    return users.find((user) => user.id === token.sub) || null;
  } catch {
    return null;
  }
}

export function publicUser({ passwordHash: _passwordHash, ...user }: StoredUser) {
  return user;
}

