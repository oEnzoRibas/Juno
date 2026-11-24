import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

const digestLength = 32;
const passwordOptions = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

export function parseCredentials(input: unknown): { email: string; password: string } | undefined {
  if (typeof input !== 'object' || input === null || !('email' in input) || !('password' in input)) return;
  if (typeof input.email !== 'string' || typeof input.password !== 'string') return;
  const email = input.email.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
  if (input.password.length < 12 || Buffer.byteLength(input.password) > 256) return;
  return { email, password: input.password };
}

function derive(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, digestLength, passwordOptions, (error, digest) => {
      if (error) reject(error);
      else resolve(digest);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  return `scrypt-v1:${salt.toString('hex')}:${(await derive(password, salt)).toString('hex')}`;
}

export async function passwordMatches(password: string, stored?: string): Promise<boolean> {
  const parts = stored?.match(/^scrypt-v1:([0-9a-f]{32}):([0-9a-f]{64})$/);
  const salt = parts ? Buffer.from(parts[1], 'hex') : Buffer.alloc(16);
  const expected = parts ? Buffer.from(parts[2], 'hex') : Buffer.alloc(digestLength);
  const actual = await derive(password, salt);
  return timingSafeEqual(actual, expected) && Boolean(parts);
}

export function digest(value: string): Buffer {
  return createHash('sha256').update(value).digest();
}

export function bearerDigest(authorization: string | undefined): Buffer | undefined {
  const token = authorization?.match(/^Bearer ([0-9a-f]{64})$/i)?.[1];
  return token ? digest(token.toLowerCase()) : undefined;
}
