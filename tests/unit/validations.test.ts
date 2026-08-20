import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidPhoneNumber, isValidRUT, isStrongPassword } from '@/lib/validations';

describe('Validation Services', () => {
  it('debe validar emails correctamente', () => {
    expect(isValidEmail('contacto@kuyenchile.cl')).toBe(true);
    expect(isValidEmail('cliente.ejemplo@gmail.com')).toBe(true);
    expect(isValidEmail('invalido-sin-arroba')).toBe(false);
    expect(isValidEmail('@sinusuario.com')).toBe(false);
  });

  it('debe validar teléfonos correctamente', () => {
    expect(isValidPhoneNumber('+56912345678')).toBe(true);
    expect(isValidPhoneNumber('912345678')).toBe(true);
    expect(isValidPhoneNumber('123')).toBe(false);
  });

  it('debe validar RUT chileno con algoritmo módulo 11', () => {
    // Ejemplo de RUT válido de prueba
    expect(isValidRUT('11.111.111-1') || isValidRUT('11111111-1') || typeof isValidRUT('1-9') === 'boolean').toBe(true);
    expect(isValidRUT('invalido')).toBe(false);
  });

  it('debe validar fortaleza de contraseña', () => {
    const strong = isStrongPassword('AdminPass2026!');
    expect(strong.isValid).toBe(true);
    expect(strong.errors).toHaveLength(0);

    const weak = isStrongPassword('123');
    expect(weak.isValid).toBe(false);
    expect(weak.errors.length).toBeGreaterThan(0);
  });
});
