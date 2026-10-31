/**
 * Helper resiliente para parsear JSON de la base de datos sin lanzar excepciones (Zero-Crash Policy)
 */
export function safeJsonParse<T>(value: any, fallback: T): T {
  if (value === null || value === undefined) {
    return fallback;
  }
  if (typeof value === 'object') {
    return value as T;
  }
  try {
    const parsed = JSON.parse(String(value));
    return parsed !== null && parsed !== undefined ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
}
