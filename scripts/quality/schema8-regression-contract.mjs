export const runtimeSqlFixtures = Object.freeze([
  'tenant-isolation.sql',
  'invitation-expiry.sql',
  'onboarding-audit.sql',
  'member-directory.sql',
  'organization-profile.sql',
  'directorates.sql',
]);

export function assertDistinctReviewAdministrators(primary, profile) {
  if (!primary.email || !profile.email || primary.email === profile.email) {
    throw new Error('The primary and profile review administrators require separate email addresses');
  }
  if (!primary.password || !profile.password || primary.password === profile.password) {
    throw new Error('The primary and profile review administrators require separate passwords');
  }
}
