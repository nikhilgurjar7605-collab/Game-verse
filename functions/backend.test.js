import { describe, it, expect } from 'vitest';
import { validateTelegramWebAppData } from './auth';
import { validateScore } from './economy';
import crypto from 'crypto';

describe('Auth Security', () => {
  it('rejects invalid or missing init data', () => {
    expect(validateTelegramWebAppData(null, 'token')).toBeNull();
    expect(validateTelegramWebAppData('', 'token')).toBeNull();
    expect(validateTelegramWebAppData('invalid_data', 'token')).toBeNull();
  });

  it('rejects tampered hash', () => {
    const fakeData = 'query_id=AAH&user=%7B%22id%22%3A123%7D&auth_date=1612111111&hash=fakehash';
    expect(validateTelegramWebAppData(fakeData, 'token')).toBeNull();
  });

  // A valid hash test would require generating a real signature in the test setup.
  // This confirms the failure cases work securely.
});

describe('Economy & Scoring Validation', () => {
  it('validates a correct score', () => {
    expect(validateScore('snake-01', 500, {})).toBe(true);
  });

  it('rejects negative scores', () => {
    expect(validateScore('snake-01', -10, {})).toBe(false);
  });

  it('rejects missing gameId', () => {
    expect(validateScore(null, 500, {})).toBe(false);
  });

  it('rejects abnormally high scores', () => {
    expect(validateScore('snake-01', 5000000, {})).toBe(false);
  });
});
