import isNumeric from '..';

describe('isNumeric', () => {
  it('should return true for numeric values', () => {
    expect(isNumeric(123)).toBe(true);
    expect(isNumeric(-123)).toBe(true);
    expect(isNumeric(0)).toBe(true);
    expect(isNumeric(123.45)).toBe(true);
    expect(isNumeric('123')).toBe(true);
    expect(isNumeric('123.45')).toBe(true);
    expect(isNumeric(NaN)).toBe(true);
    expect(isNumeric(Infinity)).toBe(true);
    expect(isNumeric(-Infinity)).toBe(true);
  });

  it('should return false for non-numeric values', () => {
    expect(isNumeric('abc')).toBe(false);
    expect(isNumeric(null)).toBe(false);
    expect(isNumeric(undefined)).toBe(false);
    expect(isNumeric({})).toBe(false);
    expect(isNumeric([])).toBe(false);
  });
});
