/**
 * Utilidades para validación y formateo oficial de RUT chileno
 * Utiliza el algoritmo estándar Módulo 11
 */

/**
 * Limpia el RUT eliminando puntos, guiones, espacios y caracteres no válidos
 */
export function cleanRut(rut: string): string {
  if (!rut) return '';
  return rut.replace(/[^0-9kK]/g, '').toUpperCase();
}

/**
 * Valida si un RUT chileno es válido utilizando el algoritmo Módulo 11
 */
export function validateRut(rut: string): boolean {
  const cleaned = cleanRut(rut);
  if (cleaned.length < 8 || cleaned.length > 9) return false;

  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1).toUpperCase();

  // Validar que el cuerpo sean solo números
  if (!/^\d+$/.test(body)) return false;

  let sum = 0;
  let multiplier = 2;

  // Calcular suma ponderada de derecha a izquierda
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i] || '0', 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const expectedRemainder = 11 - (sum % 11);
  let expectedDv = '';

  if (expectedRemainder === 11) {
    expectedDv = '0';
  } else if (expectedRemainder === 10) {
    expectedDv = 'K';
  } else {
    expectedDv = expectedRemainder.toString();
  }

  return dv === expectedDv;
}

/**
 * Formatea un RUT al estándar visual chileno con puntos y guion: XX.XXX.XXX-X
 */
export function formatRut(rut: string): string {
  const cleaned = cleanRut(rut);
  if (cleaned.length === 0) return '';
  if (cleaned.length === 1) return cleaned;

  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);

  // Formatear cuerpo con separadores de miles
  let formattedBody = '';
  let count = 0;

  for (let i = body.length - 1; i >= 0; i--) {
    formattedBody = (body[i] || '') + formattedBody;
    count++;
    if (count % 3 === 0 && i !== 0) {
      formattedBody = '.' + formattedBody;
    }
  }

  return `${formattedBody}-${dv}`;
}

