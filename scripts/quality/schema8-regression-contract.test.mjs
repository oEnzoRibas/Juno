import { describe, expect, it } from 'vitest';
import { assertDistinctReviewAdministrators, runtimeSqlFixtures } from './schema8-regression-contract.mjs';

describe('Compose regression contract', () => {
  it('executes each base and feature SQL fixture once, in migration order', () => {
    expect(runtimeSqlFixtures).toEqual([
      'tenant-isolation.sql',
      'invitation-expiry.sql',
      'onboarding-audit.sql',
      'member-directory.sql',
      'organization-profile.sql',
      'directorates.sql',
    ]);
  });

  const primary = { email: 'primary@example.invalid', password: 'primary-test-password' };
  const profile = { email: 'profile@example.invalid', password: 'profile-test-password' };

  it('accepts separate synthetic administrator credentials', () => {
    expect(() => assertDistinctReviewAdministrators(primary, profile)).not.toThrow();
  });

  it.each([
    ['identical email addresses', { ...profile, email: primary.email }, 'separate email addresses'],
    ['missing email address', { ...profile, email: '' }, 'separate email addresses'],
    ['identical passwords', { ...profile, password: primary.password }, 'separate passwords'],
    ['missing password', { ...profile, password: '' }, 'separate passwords'],
  ])('rejects %s without printing credentials', (_case, candidate, expectedMessage) => {
    expect(() => assertDistinctReviewAdministrators(primary, candidate)).toThrow(expectedMessage);
  });
});
