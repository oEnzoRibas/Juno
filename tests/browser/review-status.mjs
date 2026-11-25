import { expect, test } from '@playwright/test';

/** Reports an observed status but never serializes headers, credentials or response bodies. */
export async function verifyStatus(scenario, expected, request) {
  let response;
  try {
    response = await request();
  } catch {
    // Some client transport errors include request headers. Report only the missing status.
  }
  const actual = response?.status();
  await test.step(`[review] ${scenario} | Expected HTTP ${expected} | Actual ${actual ?? 'unavailable'}`, () => {
    expect(actual, scenario).toBe(expected);
  });
  return response;
}
