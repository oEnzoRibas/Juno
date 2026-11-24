import { describe, expect, it } from 'vitest';
import { HealthController } from './health.controller';

describe('GET /api/health', () => {
  it('exposes only a process health status', () => {
    expect(new HealthController().read()).toEqual({ status: 'ok' });
  });
});
