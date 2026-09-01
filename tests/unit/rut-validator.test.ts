import { describe, it, expect } from 'vitest';
import { validateRut, formatRut, cleanRut } from '@/lib/rut-validator';

describe('Validador Oficial de RUT Chileno (Algoritmo Módulo 11)', () => {
  it('valida correctamente RUTs chilenos reales conocidos', () => {
    // Casos válidos reales
    expect(validateRut('11.111.111-1')).toBe(true);
    expect(validateRut('12.345.678-5')).toBe(true);
    expect(validateRut('7.654.321-6')).toBe(true);
    expect(validateRut('19.876.543-0')).toBe(true);
    expect(validateRut('10.000.027-K')).toBe(true);
    expect(validateRut('10000027k')).toBe(true);
  });

  it('rechaza RUTs con dígito verificador adulterado o falso', () => {
    expect(validateRut('11.111.111-2')).toBe(false);
    expect(validateRut('12.345.678-9')).toBe(false);
    expect(validateRut('7.654.321-4')).toBe(false);
    expect(validateRut('10.000.027-2')).toBe(false);
  });

  it('rechaza entradas con formato inválido, demasiado cortas o no numéricas', () => {
    expect(validateRut('')).toBe(false);
    expect(validateRut('12345')).toBe(false);
    expect(validateRut('abcdefg-h')).toBe(false);
    expect(validateRut('12.345.678-99')).toBe(false);
  });

  it('formatea correctamente el RUT con puntos y guion', () => {
    expect(formatRut('123456785')).toBe('12.345.678-5');
    expect(formatRut('7654321k')).toBe('7.654.321-K');
    expect(formatRut('19876543K')).toBe('19.876.543-K');
    expect(formatRut('111111111')).toBe('11.111.111-1');
  });

  it('limpia caracteres no válidos y convierte minúsculas a mayúsculas', () => {
    expect(cleanRut('12.345.678-k')).toBe('12345678K');
    expect(cleanRut('  19.876.543 - K  ')).toBe('19876543K');
    expect(cleanRut('11-111-111-1')).toBe('111111111');
  });
});
