import { describe, expect, it } from 'vitest';
import { bearerDigest, digest, hashPassword, parseCredentials, passwordMatches } from './credentials';

describe('local credentials', () => {
  it('normalizes email and preserves whitespace in the password', () => {
    expect(parseCredentials({ email: ' DEMO@example.invalid ', password: ' synthetic pass ' })).toEqual({
      email: 'demo@example.invalid',
      password: ' synthetic pass ',
    });
    expect(parseCredentials({ email: 'demo@example.invalid', password: 'a'.repeat(257) })).toBeUndefined();
  });

  it('uses a salted password digest and rejects invalid credentials', async () => {
    const password = 'synthetic fixture password';
    const [first, second] = await Promise.all([hashPassword(password), hashPassword(password)]);
    expect(first).not.toEqual(second);
    expect(first).not.toContain(password);
    await expect(passwordMatches(password, first)).resolves.toBe(true);
    await expect(passwordMatches('incorrect fixture password', first)).resolves.toBe(false);
    await expect(passwordMatches(password)).resolves.toBe(false);
  });

  it('accepts only correctly formed bearer tokens', () => {
    const token = 'ab'.repeat(32);
    expect(bearerDigest(`Bearer ${token}`)).toEqual(digest(token));
    expect(bearerDigest('Bearer invalid')).toBeUndefined();
  });
});
