import { describe, it, expect } from 'vitest';
import { getPasswordScore, getPasswordLabel } from './passwordStrength';

describe('passwordStrength', () => {
  it('scores and labels empty', () => {
    expect(getPasswordScore('')).toBe(0);
    expect(getPasswordLabel(0)).toBe('empty');
  });

  it('scores weak/ok/good/strong', () => {
    expect(getPasswordLabel(getPasswordScore('abc'))).toBe('weak');
    expect(getPasswordLabel(getPasswordScore('abcA'))).toBe('ok');
    expect(getPasswordLabel(getPasswordScore('abcA1'))).toBe('good');
    expect(getPasswordLabel(getPasswordScore('abcA1!'))).toBe('strong');
  });
});
