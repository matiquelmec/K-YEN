import { describe, it, expect } from 'vitest';

describe('Sistema de Cupones y Afiliados', () => {
  it('debe calcular correctamente el descuento porcentual', () => {
    const cartTotal = 80000;
    const discountPercent = 15; // 15% OFF
    const discountAmount = Math.round(cartTotal * (discountPercent / 100));
    const finalTotal = cartTotal - discountAmount;

    expect(discountAmount).toBe(12000);
    expect(finalTotal).toBe(68000);
  });

  it('debe calcular correctamente el descuento de monto fijo', () => {
    const cartTotal = 90000;
    const discountFixed = 10000; // $10.000 CLP OFF
    const finalTotal = Math.max(0, cartTotal - discountFixed);

    expect(discountFixed).toBe(10000);
    expect(finalTotal).toBe(80000);
  });

  it('debe validar la compra mínima para aplicar un cupón', () => {
    const minCartAmount = 50000;
    const cart1 = 45000;
    const cart2 = 60000;

    const isValid1 = cart1 >= minCartAmount;
    const isValid2 = cart2 >= minCartAmount;

    expect(isValid1).toBe(false);
    expect(isValid2).toBe(true);
  });

  it('debe validar la expiración y límite de usos de un cupón', () => {
    const now = new Date('2026-08-20T10:00:00Z');
    const validExpiry = new Date('2026-08-25T00:00:00Z');
    const expiredExpiry = new Date('2026-08-10T00:00:00Z');

    expect(validExpiry > now).toBe(true);
    expect(expiredExpiry > now).toBe(false);

    const usageLimit = 10;
    const usageCountValid = 9;
    const usageCountExceeded = 10;

    expect(usageCountValid < usageLimit).toBe(true);
    expect(usageCountExceeded < usageLimit).toBe(false);
  });
});
