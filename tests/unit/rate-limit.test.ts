import { describe, it, expect } from 'vitest';
import { checkRateLimit } from '@/lib/rate-limit';

describe('Rate Limiter', () => {
  it('debe permitir peticiones dentro del límite permitido', () => {
    const mockReq = {
      headers: new Headers({ 'x-forwarded-for': '192.168.1.100' }),
    } as any;

    const res1 = checkRateLimit(mockReq, 3, 1000);
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(2);

    const res2 = checkRateLimit(mockReq, 3, 1000);
    expect(res2.success).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = checkRateLimit(mockReq, 3, 1000);
    expect(res3.success).toBe(true);
    expect(res3.remaining).toBe(0);

    // 4ta petición: debe fallar
    const res4 = checkRateLimit(mockReq, 3, 1000);
    expect(res4.success).toBe(false);
    expect(res4.remaining).toBe(0);
  });
});
