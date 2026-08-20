/**
 * 🛡️ Env Validator - Tienda KÜYEN
 * 
 * Valida que todas las variables de entorno críticas estén presentes.
 * En build/producción emite advertencias para no romper la compilación estática si aún no se configuran las variables en el hosting.
 */

const REQUIRED_ENV_VARS = [
  'TURSO_CONNECTION_URL',
  'TURSO_AUTH_TOKEN',
  'JWT_SECRET',
  'MP_ACCESS_TOKEN',
  'ADMIN_PASSWORD',
] as const;

export function validateEnv(): boolean {
  if (typeof window !== 'undefined') return true;

  const missingVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    const errorMsg = `❌ [ENV_VALIDATOR] Falta(n) variable(s) de entorno crítica(s): ${missingVars.join(', ')}`;
    console.error(errorMsg);
  }

  return true;
}

if (typeof window === 'undefined') {
  validateEnv();
}
