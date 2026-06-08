import { describe, it, expect } from 'vitest';

// Smoke test — verifies the Vitest runner is wired correctly.
// Replace/expand as real units land (Week 2+).
describe('smoke', () => {
  it('runs the test runner', () => {
    expect(1 + 1).toBe(2);
  });
});
