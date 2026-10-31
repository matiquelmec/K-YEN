import { describe, it, expect } from 'vitest';
import { safeJsonParse } from '@/lib/utils/json';

describe('Resilient JSON Parsing (Anti-Crash Guardrails)', () => {
  it('should parse valid JSON strings correctly', () => {
    const jsonStr = JSON.stringify({ name: 'Maria', total: 45000 });
    expect(safeJsonParse(jsonStr, {})).toEqual({ name: 'Maria', total: 45000 });
  });

  it('should safely return fallback when string is plain text or invalid JSON without throwing', () => {
    const rawText = 'Flow Order: 186679066';
    expect(() => safeJsonParse(rawText, {})).not.toThrow();
    expect(safeJsonParse(rawText, {})).toEqual({});
  });

  it('should safely return array fallback when parsing items array', () => {
    const invalidItems = 'Unexpected string from old DB row';
    expect(safeJsonParse(invalidItems, [])).toEqual([]);
  });

  it('should return already-parsed objects directly', () => {
    const obj = { city: 'Punta Arenas' };
    expect(safeJsonParse(obj, {})).toEqual(obj);
  });
});
