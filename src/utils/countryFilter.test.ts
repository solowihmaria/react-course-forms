import { describe, it, expect } from 'vitest';
import { filterCountries } from './countryFilter';

const LIST = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Poland',
  'Russia',
  'Turkey',
];

describe('filterCountries', () => {
  it('returns first N when query is empty', () => {
    expect(filterCountries('', LIST, 3)).toEqual(LIST.slice(0, 3));
  });

  it('filters case-insensitively and respects limit', () => {
    const res = filterCountries('an', LIST, 5);
    expect(res).toEqual(['Canada', 'Germany', 'France', 'Poland']);
    expect(res.length).toBeLessThanOrEqual(5);
  });

  it('returns empty array when nothing matches', () => {
    expect(filterCountries('zzz', LIST)).toEqual([]);
  });
});
