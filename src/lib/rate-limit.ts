import { NextRequest } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * 🛡️ Rate Limiter en memoria para Serverless / Edge
 * Previene ataques de fuerza bruta y DoS limitando peticiones por IP
 */
export function checkRateLimit(
  request: NextRequest | Request,
  limit: number = 10,
  windowMs: number = 60 * 1000 // 1 minuto por defecto
): { success: boolean; limit: number; remaining: number; reset: number } {
  const headers = 'headers' in request ? request.headers : undefined;
  const ip =
    headers?.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers?.get('x-real-ip') ||
    '127.0.0.1';

  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // Si no existe o expiró la ventana temporal, reiniciar
  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs;
    rateLimitMap.set(ip, { count: 1, resetTime });
    return { success: true, limit, remaining: limit - 1, reset: resetTime };
  }

  // Si se supera el límite permitido
  if (record.count >= limit) {
    return { success: false, limit, remaining: 0, reset: record.resetTime };
  }

  record.count += 1;
  return { success: true, limit, remaining: limit - record.count, reset: record.resetTime };
}
