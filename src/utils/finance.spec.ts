import { percentChange } from "./percentage";

describe.only('percentChange', () => {
  it('should return 100% increase from 100 to 200', () => {
    expect(percentChange(200, 100)).toBe(100);
  });

  it('should return -50% decrease from 100 to 50', () => {
    expect(percentChange(50, 100)).toBe(-50);
  });

  it('should return 100% if previous is 0 and current is 100', () => {
    expect(percentChange(100, 0)).toBe(100);
  });

  it('should return 0% if both current and previous are 0', () => {
    expect(percentChange(0, 0)).toBe(0);
  });

  it('should return 200% increase from -50 to 50', () => {
    expect(percentChange(50, -50)).toBe(-200);
  });
});
